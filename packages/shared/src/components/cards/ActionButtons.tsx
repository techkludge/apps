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
  bookmarkStyle?: string;
};

export default function ActionButtons({
  post,
  showShare,
  onUpvoteClick,
  onCommentClick,
  onBookmarkClick,
  onShare,
  className,
  bookmarkStyle,
  children,
}: ActionButtonsProps): ReactElement {
  const canUpvoteAndComment = false;

  const upvotesAndCommentsStatic = (
    <div className="flex">
      <SimpleTooltip content={post.upvoted ? 'Remove upvote' : 'Upvote'}>
        <div className="flex items-center" style={{ width: rem(78) }}>
          <span
            id={`post-${post.id}-upvote-btn`}
            className="flex mr-2"
          >
            <UpvoteIcon className="text-xl" />
          </span>
          <InteractionCounter value={post.numUpvotes > 0 && post.numUpvotes} />
        </div>
      </SimpleTooltip>
      <SimpleTooltip content="Comments">
        <div className="flex items-center justify-end" style={{ width: rem(78) }}>
          <span
            id={`post-${post.id}-comment-btn`}
            className="flex mr-2"
          >
            <CommentIcon className="text-xl" />
          </span>
          <InteractionCounter
            value={post.numComments > 0 && post.numComments}
          />
        </div>
      </SimpleTooltip>
    </div>
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
    <div className={classNames(styles.actionButtons, 'flex', className)}>
      {canUpvoteAndComment
        ? upvotesAndCommentsButtons
        : upvotesAndCommentsStatic}
      <SimpleTooltip content={post.bookmarked ? 'Remove bookmark' : 'Bookmark'}>
          <Button
            className={classNames('my-auto btn-tertiary-bun', bookmarkStyle)}
            icon={<BookmarkIcon />}
            buttonSize="small"
            pressed={post.bookmarked}
            onClick={() => onBookmarkClick?.(post, !post.bookmarked)}
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
