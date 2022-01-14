import { useContext } from 'react';
import useBookmarkPost from '../useBookmarkPost';
import { FeedItem } from '../useFeed';
import { postAnalyticsEvent, optimisticPostUpdateInFeed } from '../../lib/feed';
import { Post } from '../../graphql/posts';
import AuthContext from '../../contexts/AuthContext';
import AnalyticsContext from '../../contexts/AnalyticsContext';
import { QueryClient, useQueryClient } from 'react-query';

export default function useFeedBookmarkPost(
  items: FeedItem[],
  updatePost: (page: number, index: number, post: Post) => void,
  columns: number,
  feedName: string,
): (
  post: Post,
  index: number,
  row: number,
  column: number,
  bookmarked: boolean,
) => Promise<void> {
  const { user, showLogin } = useContext(AuthContext);
  const { trackEvent } = useContext(AnalyticsContext);
  const queryClient = useQueryClient();

  const addBookmark = async (updatePost) => {
    const queryKey = ['bookmarks', user?.id];

    const { pages } = await queryClient.getQueryData(queryKey);

    const index = pages[0]?.page?.edges.findIndex(
      ({ node }) => node.id === updatePost.id,
    );
    if (index === -1) {
      pages[0].page?.edges.push({ node: updatePost });
    }
    console.log(pages, index);
  };

  const deleteBookmark = async (post) => {
    const queryKey = ['bookmarks', user?.id];
    await queryClient.cancelQueries(queryKey);
    const { pages, ...rest } = await queryClient.getQueryData(queryKey);

    const items = pages[0]?.page?.edges.filter(
      ({ node }) => node.id !== post.id,
    );

    pages[0].page.edges = items;
    queryClient.setQueryData(queryKey, { rest, pages });
  };

  const { bookmark, removeBookmark } = useBookmarkPost<{
    id: string;
    index: number;
  }>({
    onBookmarkMutate: optimisticPostUpdateInFeed(items, updatePost, () => {
      return {
        bookmarked: true,
      };
    }),
    onRemoveBookmarkMutate: optimisticPostUpdateInFeed(
      items,
      updatePost,
      () => ({ bookmarked: false }),
    ),
  });

  return async (post, index, row, column, bookmarked): Promise<void> => {
    if (!user) {
      showLogin('bookmark');
      return;
    }
    trackEvent(
      postAnalyticsEvent(
        bookmarked ? 'bookmark post' : 'remove post bookmark',
        post,
        {
          columns,
          column,
          row,
          extra: { origin: 'feed', feed: feedName },
        },
      ),
    );

    if (bookmarked) {
      addBookmark(post);
      await bookmark({ id: post.id, index });
    } else {
      deleteBookmark(post);
      await removeBookmark({ id: post.id, index });
    }
  };
}
