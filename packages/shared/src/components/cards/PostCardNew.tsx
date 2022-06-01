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
  CardFooter,
  CardHeader,
  CardImage,
  CardNotification,
  CardSpace,
  CardTextContainer,
  CardTitle,
  featuredCommentsToButtons,
  getPostClassNames,
  NewCardTextContainer,
} from './Card';
import { Comment } from '../../graphql/comments';
import styles from './Card.module.css';
import TrendingFlag from './TrendingFlag';
import PostMetadata from './PostMetadata';
import ActionButtons from './ActionButtons';
import SourceButton from './SourceButton';
import PostAuthor from './PostAuthor';
import { Button } from '../buttons/Button';
import OpenLinkIcon from '../../../icons/open_link.svg';
import ModalPostLink from './ModalPostLink';
import { ProfileTooltip } from '../profile/ProfileTooltip';
import { ProfileImageLink } from '../profile/ProfileImageLink';
import PostLink from './PostLink';
import AnalyticsContext from '../../contexts/AnalyticsContext';
import { Features, isFeaturedEnabled } from '../../lib/featureManagement';
import FeaturesContext from '../../contexts/FeaturesContext';
import SimpleTooltip from '../tooltips/SimpleTooltip';
import MenuIcon from '../../../icons/menu.svg';
import { PostCardProps } from './PostCard';
import BookmarkIcon from '../../../icons/bookmark.svg';

const FeaturedComment = dynamic(() => import('./FeaturedComment'));

type Callback = (post: Post) => unknown;

export const PostCardNew = forwardRef(function PostCardNew(
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
    bookmarkStyle,
    ...props
  }: PostCardProps,
  ref: Ref<HTMLElement>,
): ReactElement {
  const [selectedComment, setSelectedComment] = useState<Comment>();
  const { trending } = post;

  const customStyle =
    selectedComment && !showImage ? { minHeight: '15.125rem' } : {};

  const { trackEvent } = useContext(AnalyticsContext);

  const onOpenArticlePage = () => {
    trackEvent({
      eventName: 'go to link',
      post: post,
    });
  };

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

      <NewCardTextContainer>
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
      </NewCardTextContainer>
      <CardSpace />
      <PostMetadata
        createdAt={post.createdAt}
        readTime={post.readTime}
        className="mx-6"
      />
      <div className="flex items-center mt-5 ml-4">
        <ActionButtons
          post={post}
          onUpvoteClick={onUpvoteClick}
          onCommentClick={onCommentClick}
          onBookmarkClick={onBookmarkClick}
          onMenuClick={onMenuClick}
          showShare={showShare}
          onShare={onShare}
          className={classNames('flex-1 justify-between ml-2', !showImage && 'mt-4')}
          bookmarkStyle=" mouse:group-hover:visible"
          isV1={false}
        />
      </div>
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
            <div className="flex mb-1 mx-1">
              <SourceButton post={post} style={{ marginRight: '0.25rem' }} />
              {featuredCommentsToButtons(
                post.featuredComments,
                setSelectedComment,
              )}
              {post.author && (
                <ProfileTooltip
                  user={post.author}
                  tooltip={{ appendTo: document?.body }}
                >
                  <ProfileImageLink
                    user={post.author}
                    picture={{ size: 'medium' }}
                  />
                </ProfileTooltip>
              )}
            </div>
            {isArticleModalByDefault && (
              <Button
                className="mouse:invisible mouse:group-hover:visible btn-primary w-[10.625rem]"
                buttonSize="small"
                rightIcon={<OpenLinkIcon />}
                tag="a"
                href={post.permalink}
                target="_blank"
                onClick={onOpenArticlePage}
              >
                <p className="truncate w-28">{post.commentsPermalink}</p>
              </Button>
            )}
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
function flags(HideSignupProfileImage: Features, flags: any) {
  throw new Error('Function not implemented.');
}
