import React, { ReactElement } from 'react';
import { Post } from '../../graphql/posts';
import { CardLink } from './Card';

export type PostLinkProps = {
  post: Post;
  onLinkClick?: (post: Post) => unknown;
};

export default function PostLink({
  post,
  onLinkClick,
}: PostLinkProps): ReactElement {
  return (
    <CardLink
      href="#"
      title={post.title}
      onClick={() => onLinkClick?.(post)}
    />
  );
}
