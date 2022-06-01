import React, { forwardRef, ReactElement, Ref, useState } from 'react';
import classNames from 'classnames';
import { Comment } from '../../graphql/comments';
import { PostCardProps } from './PostCardNew';
import {
  getPostClassNames,
  ListCard,
  ListCardTitle,
  ListCardDivider,
  ListCardAside,
  ListCardMain,
  featuredCommentsToButtons,
  CardNotification,
} from './Card';
import PostLink from './PostLink';
import PostMetadata from './PostMetadata';
import ActionButtons from './ActionButtons';
import SourceButton from './SourceButton';
import styles from './Card.module.css';
import ListFeaturedComment from './ListFeaturedComment';
import TrendingFlag from './TrendingFlag';
import PostAuthor from './PostAuthor';
import PostOptions from '../buttons/OptionsButton';
import OpenLinkIcon from '../../../icons/open_link.svg';
import { Button } from '../buttons/Button';
import { ProfileTooltip } from '../profile/ProfileTooltip';
import { ProfileImageLink } from '../profile/ProfileImageLink';
import ModalPostLink from './ModalPostLink';
import SimpleTooltip from '../tooltips/SimpleTooltip';
import MenuIcon from '../../../icons/menu.svg';
import ActionsButton2 from './ActionsButton2';
import BookmarkIcon from '../../../icons/bookmark.svg';

export const PostListNew = forwardRef(function PostListNew(
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
    postHeadingFont,
    isArticleModalByDefault,
    bookmarkStyle,
    ...props
  }: PostCardProps,
  ref: Ref<HTMLElement>,
): ReactElement {
  const [selectedComment, setSelectedComment] = useState<Comment>();
  const { trending } = post;

  const card = (
    <ListCard
      {...props}
      className={getPostClassNames(post, selectedComment, className)}
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

      <ListCardDivider />
      <ListCardMain>
        <ListCardTitle className={classNames(className, postHeadingFont)}>
          {post.title}
        </ListCardTitle>
        <PostMetadata
          createdAt={post.createdAt}
          readTime={post.readTime}
          className="mb-2 mt-1"
        >
          <PostAuthor
            post={post}
            selectedComment={selectedComment}
            className="ml-2"
          />
        </PostMetadata>
        <div className="flex">
          <div className="flex items-center">
            <SourceButton post={post} tooltipPosition="top" className="mx-1" />
            {featuredCommentsToButtons(
              post.featuredComments,
              setSelectedComment,
              null,
              'my-1',
              'top',
            )}
            {post.author && (
              <ProfileTooltip
                user={post.author}
                tooltip={{ appendTo: document?.body }}
              >
                <ProfileImageLink
                  user={post.author}
                  picture={{ size: 'medium' }}
                  className="mr-1"
                />
              </ProfileTooltip>
            )}
            <Button
              buttonSize="medium"
              rightIcon={<OpenLinkIcon />}
              tag="a"
              href={post.permalink}
              target="_blank"
              className="p-2 mr-4"
            ></Button>
          </div>
          <ListCardDivider />
          <ActionButtons
            post={post}
            onUpvoteClick={onUpvoteClick}
            onCommentClick={onCommentClick}
            onBookmarkClick={onBookmarkClick}
            onMenuClick={onMenuClick}
            showShare={showShare}
            onShare={onShare}
            className="flex items-center ml-4"
            bookmarkStyle="mouse:invisible mouse:group-hover:visible"
            isV1={false}
          >
            {notification && (
              <CardNotification className="absolute right-0 bottom-0 z-2 text-center">
                {notification}
              </CardNotification>
            )}
          </ActionButtons>
        </div>
      </ListCardMain>
      {selectedComment && (
        <ListFeaturedComment
          comment={selectedComment}
          featuredComments={post.featuredComments}
          onCommentClick={setSelectedComment}
          onBack={() => setSelectedComment(null)}
          className={styles.show}
        />
      )}
      {children}
    </ListCard>
  );
  if (trending) {
    return (
      <div className={`relative ${styles.cardContainer}`}>
        {card}
        <TrendingFlag trending={trending} listMode />
      </div>
    );
  }
  return card;
});
