import React, {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  Ref,
  useState,
} from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { Post } from '../../graphql/posts';
import {
  Card,
  CardFooter,
  CardHeader,
  CardImage,
  CardNotification,
  CardSpace,
  CardTextContainer,
  CardTitle,
  featuredCommentsToButtons,
  getPostClassNames,
} from './Card';
import { Comment } from '../../graphql/comments';
import styles from './Card.module.css';
import TrendingFlag from './TrendingFlag';
import PostLink from './PostLink';
import PostMetadata from './PostMetadata';
import ActionButtons from './ActionButtons';
import SourceButton from './SourceButton';
import PostAuthor from './PostAuthor';
import { ProfilePicture } from '../ProfilePicture';
import { Button } from '../buttons/Button';
import { useShareOrCopyLink } from '../../hooks/useShareOrCopyLink';
import { postAnalyticsEvent } from '../../lib/feed';

const FeaturedComment = dynamic(() => import('./FeaturedComment'));

type Callback = (post: Post) => unknown;

export type PostCardProps = {
  post: Post;
  onLinkClick?: Callback;
  onUpvoteClick?: (post: Post, upvoted: boolean) => unknown;
  onCommentClick?: Callback;
  onBookmarkClick?: (post: Post, bookmarked: boolean) => unknown;
  onMenuClick?: (event: React.MouseEvent, post: Post) => unknown;
  showShare?: boolean;
  onShare?: Callback;
  openNewTab?: boolean;
  enableMenu?: boolean;
  menuOpened?: boolean;
  notification?: string;
  showImage?: boolean;
  postHeadingFont: string;
  onMessage?: (
    message: string,
    postIndex: number,
    timeout?: number,
  ) => Promise<unknown>;
} & HTMLAttributes<HTMLDivElement>;

export const PostCard = forwardRef(function PostCard(
  {
    post,
    onLinkClick,
    onUpvoteClick,
    onCommentClick,
    onBookmarkClick,
    onMenuClick,
    showShare,
    onShare,
    openNewTab,
    enableMenu,
    menuOpened,
    notification,
    className,
    children,
    showImage = true,
    style,
    postHeadingFont,
    onMessage,
    ...props
  }: PostCardProps,
  ref: Ref<HTMLElement>,
): ReactElement {
  const [selectedComment, setSelectedComment] = useState<Comment>();
  const { trending } = post;

  const customStyle =
    selectedComment && !showImage ? { minHeight: '15.125rem' } : {};

  const shareLink = post?.commentsPermalink;
  const copyLink = async () => {
    await navigator.clipboard.writeText(shareLink);
    onMessage('✅ Copied link to clipboard', 1);
  };

  const onShareOrCopyLink = useShareOrCopyLink({
    link: shareLink,
    text: post?.title,
    copyLink,
    trackObject: () =>
      postAnalyticsEvent('share post', post, {
        extra: { origin: 'post card' },
      }),
  });
  const card = (
    <Card
      {...props}
      className={getPostClassNames(post, selectedComment, className)}
      style={{ ...style, ...customStyle }}
      ref={ref}
    >
      <PostLink post={post} openNewTab={openNewTab} onLinkClick={onLinkClick} />
      <CardTextContainer>
        <CardHeader>
          {notification ? (
            <CardNotification className="flex-1 text-center">
              {notification}
            </CardNotification>
          ) : (
            ''
          )}
        </CardHeader>
        <CardTitle className={classNames(className, postHeadingFont)}>
          {post.title}
        </CardTitle>
      </CardTextContainer>
      <CardSpace />
      <PostMetadata
        createdAt={post.createdAt}
        readTime={post.readTime}
        className="mx-4"
      />
      <ActionButtons
        post={post}
        onUpvoteClick={onUpvoteClick}
        onCommentClick={onCommentClick}
        onBookmarkClick={onBookmarkClick}
        onMenuClick={onMenuClick}
        showShare={showShare}
        onShare={onShare}
        className={classNames(
          'justify-between mt-[1.625rem]',
          !showImage && 'mt-4',
        )}
      />
      {!showImage && (
        <PostAuthor
          post={post}
          selectedComment={selectedComment}
          className="mx-4 mt-2"
        />
      )}
      {showImage && (
        <CardImage
          imgAlt="Post Cover image"
          imgSrc={post.image}
          fallbackSrc="https://res.cloudinary.com/daily-now/image/upload/f_auto/v1/placeholders/1"
          className="my-2"
        >
          <CardFooter>
            <SourceButton
              post={post}
              style={{ marginRight: '0.875rem' }}
              className="mx-1 mb-1"
            />
            {featuredCommentsToButtons(
              post.featuredComments,
              setSelectedComment,
            )}
            {post.author && (
              <ProfilePicture
                className="rounded-12"
                size="medium"
                user={post.author}
              />
            )}
            <Button className="btn-primary" onClick={onShareOrCopyLink}>
              {post.commentsPermalink}
            </Button>
          </CardFooter>
        </CardImage>
      )}

      {selectedComment && (
        <FeaturedComment
          comment={selectedComment}
          featuredComments={post.featuredComments}
          onCommentClick={setSelectedComment}
          onBack={() => setSelectedComment(null)}
          className={styles.show}
        />
      )}
      {children}
    </Card>
  );

  if (trending) {
    return (
      <div className={`relative ${styles.cardContainer}`}>
        {card}
        <TrendingFlag trending={trending} />
      </div>
    );
  }
  return card;
});
