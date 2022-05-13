import React, { ReactElement, ReactNode } from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import styles from './Card.module.css';
import { Post } from '../../graphql/posts';
import UpvoteIcon from '../../../icons/upvote.svg';
import rem from '../../../macros/rem.macro';
import InteractionCounter from '../InteractionCounter';
import { QuaternaryButton } from '../buttons/QuaternaryButton';
import CommentIcon from '../../../icons/comment.svg';
import BookmarkIcon from '../../../icons/bookmark.svg';
import { Button } from '../buttons/Button';
import { SimpleTooltip } from '../tooltips/SimpleTooltip';
import MenuIcon from '../../../icons/menu.svg';

const ShareIcon = dynamic(() => import('../../../icons/share.svg'));

export type ActionButtonsProps = {
  post: Post;
  showShare: boolean;
  onUpvoteClick?: (post: Post, upvoted: boolean) => unknown;
  onCommentClick?: (post: Post) => unknown;
  onBookmarkClick?: (post: Post, bookmarked: boolean) => unknown;
  onShare?: (post: Post) => unknown;
  className?: string;
  children?: ReactNode;
  onMenuClick?: (event: React.MouseEvent, post: Post) => unknown;
};

export default function ActionButtons({
  post,
  showShare,
  onUpvoteClick,
  onCommentClick,
  onBookmarkClick,
  onShare,
  className,
  children,
  onMenuClick,
}: ActionButtonsProps): ReactElement {
  const canUpvoteAndComment = false;

  const upvotesAndCommentsStatic = (
    <SimpleTooltip content="Example text">
      <Button
        className="mouse:group-hover:visible btn-tertiary w-40 flex"
        onClick={() => onCommentClick?.(post)}
      >
        <div className="flex">
          <span
            id={`post-${post.id}-upvote-btn`}
            style={{ marginRight: rem(15) }}
            className="flex"
          >
            <UpvoteIcon />
          </span>
          <InteractionCounter value={post.numUpvotes > 0 && post.numUpvotes} />
          <span
            id={`post-${post.id}-comment-btn`}
            style={{ marginLeft: rem(30), marginRight: rem(15) }}
            className="flex"
          >
            <CommentIcon />
          </span>
          <InteractionCounter
            value={post.numComments > 0 && post.numComments}
          />
        </div>
      </Button>
    </SimpleTooltip>
  );

  const upvotesAndCommentsButtons = (
    <>
      <SimpleTooltip content={post.upvoted ? 'Remove upvote' : 'Upvote'}>
        <QuaternaryButton
          id={`post-${post.id}-upvote-btn`}
          icon={<UpvoteIcon />}
          buttonSize="small"
          pressed={post.upvoted}
          onClick={() => onUpvoteClick?.(post, !post.upvoted)}
          style={{ width: rem(78) }}
          className="btn-tertiary-avocado"
        >
          <InteractionCounter value={post.numUpvotes > 0 && post.numUpvotes} />
        </QuaternaryButton>
      </SimpleTooltip>
      <SimpleTooltip content="Comments">
        <QuaternaryButton
          id={`post-${post.id}-comment-btn`}
          icon={<CommentIcon />}
          buttonSize="small"
          pressed={post.commented}
          onClick={() => onCommentClick?.(post)}
          style={{ width: rem(78) }}
          className="btn-tertiary-avocado"
        >
          <InteractionCounter
            value={post.numComments > 0 && post.numComments}
          />
        </QuaternaryButton>
      </SimpleTooltip>
    </>
  );

  return (
    <div
      className={classNames(
        styles.actionButtons,
        'flex flex-row items-center',
        canUpvoteAndComment && 'ml-4',
        className,
      )}
    >
      {canUpvoteAndComment
        ? upvotesAndCommentsButtons
        : upvotesAndCommentsStatic}

      <SimpleTooltip content={post.bookmarked ? 'Remove bookmark' : 'Bookmark'}>
        <Button
          className="mouse:invisible mouse:group-hover:visible my-auto btn-tertiary-bun"
          style={canUpvoteAndComment ? {} : { marginRight: '-3rem' }}
          icon={<BookmarkIcon />}
          buttonSize="small"
          pressed={post.bookmarked}
          onClick={() => onBookmarkClick?.(post, !post.bookmarked)}
        />
      </SimpleTooltip>
      <SimpleTooltip content="Options">
        <Button
          className="mouse:invisible mouse:group-hover:visible my-auto btn-tertiary"
          style={{ marginRight: '1rem', marginLeft: '0.5rem' }}
          icon={<MenuIcon />}
          onClick={(event) => onMenuClick?.(event, post)}
          buttonSize="small"
        />
      </SimpleTooltip>
      {showShare && (
        <SimpleTooltip content="Share post">
          <Button
            icon={<ShareIcon />}
            buttonSize="small"
            onClick={() => onShare?.(post)}
            className="btn-tertiary"
          />
        </SimpleTooltip>
      )}
      {children}
    </div>
  );
}
