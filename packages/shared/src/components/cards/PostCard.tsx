import React, {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  Ref,
  useContext,
  useState,
} from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { Post } from '../../graphql/posts';
import {
  Card,
  CardHeader,
  CardImage,
  CardNotification,
  CardSpace,
  CardTextContainer,
  CardTitle,
  featuredCommentsToButtons,
  getPostClassNames,
} from './Card';
import FeatherIcon from '../../../icons/feather.svg';
import { Comment } from '../../graphql/comments';
import styles from './Card.module.css';
import TrendingFlag from './TrendingFlag';
import PostLink from './PostLink';
import PostMetadata from './PostMetadata';
import ActionButtons from './ActionButtons';
import SourceButton from './SourceButton';
import PostAuthor from './PostAuthor';
import OptionsButton from '../buttons/OptionsButton';
import { ProfilePicture } from '../ProfilePicture';
import { Button } from '../buttons/Button';
import OpenLinkIcon from '../../../icons/open_link.svg';
import AnalyticsContext from '../../contexts/AnalyticsContext';
import ModalPostLink from './ModalPostLink';

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
  isArticleModalByDefault: boolean;
  isV1: boolean;
  bookmarkStyle?: string;
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
    isArticleModalByDefault,
    isV1,
    ...props
  }: PostCardProps,
  ref: Ref<HTMLElement>,
): ReactElement {
  const [selectedComment, setSelectedComment] = useState<Comment>();
  const { trending } = post;
  const { trackEvent } = useContext(AnalyticsContext);

  const onOpenArticlePage = () => {
    trackEvent({
      eventName: 'go to link',
      post: post,
    });
  };

  const customStyle =
    selectedComment && !showImage ? { minHeight: '15.125rem' } : {};
  const card = (
    <Card
      {...props}
      className={getPostClassNames(post, selectedComment, className)}
      style={{ ...style, ...customStyle }}
      ref={ref}
    >
      {isArticleModalByDefault ? (
        <ModalPostLink post={post} onLinkClick={onCommentClick} />
      ) : (
        <PostLink
          post={post}
          openNewTab={openNewTab}
          onLinkClick={onLinkClick}
        />
      )}
      <CardTextContainer>
        <CardHeader>
          {notification ? (
            <CardNotification className="flex-1 text-center">
              {notification}
            </CardNotification>
          ) : (
            <>
              <SourceButton post={post} style={{ marginRight: '0.875rem' }} />
              {featuredCommentsToButtons(
                post.featuredComments,
                setSelectedComment,
              )}
              {isArticleModalByDefault && (
                <Button
                  className="mouse:invisible mouse:group-hover:visible btn-primary w-[10.625rem] ml-6"
                  buttonSize="small"
                  rightIcon={<OpenLinkIcon />}
                  tag="a"
                  href={post.permalink}
                  target="_blank"
                  onClick={onOpenArticlePage}
                >
                  <p className="truncate w-[7.313rem]">
                    {post.commentsPermalink}
                  </p>
                </Button>
              )}

              <OptionsButton
                onClick={(event) => onMenuClick?.(event, post)}
                post={post}
              />
            </>
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
          {post.author && (
            <div
              className={classNames(
                'absolute flex items-center py-2 px-3 text-theme-label-secondary bg-theme-bg-primary z-1 font-bold typo-callout w-full',
                selectedComment ? 'invisible' : styles.authorBox,
              )}
            >
              <ProfilePicture
                className="rounded-full"
                size="small"
                user={post.author}
              />
              <span className="flex-1 mx-3 truncate">{post.author.name}</span>
              <FeatherIcon className="text-2xl text-theme-status-help" />
            </div>
          )}
        </CardImage>
      )}
      <div className="mx-4 justify-between">
        <ActionButtons
          post={post}
          onUpvoteClick={onUpvoteClick}
          onCommentClick={onCommentClick}
          onBookmarkClick={onBookmarkClick}
          showShare={showShare}
          onShare={onShare}
          isV1={isV1}
          className={classNames('justify-between', isV1 && '-ml-4', !showImage && 'mt-4')}
        />
      </div>
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
