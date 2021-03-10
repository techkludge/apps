import React, { HTMLAttributes, ReactElement } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { getTooltipProps } from '../../lib/tooltip';

interface User {
  name: string;
  image: string;
  permalink: string;
}

export interface ProfileLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  user: User;
}

const Anchor = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

export function ProfileLink({
  user,
  children,
  ...props
}: ProfileLinkProps): ReactElement {
  return (
    <Link href={user.permalink} passHref prefetch={false}>
      <Anchor {...getTooltipProps(user.name)} {...props}>
        {children}
      </Anchor>
    </Link>
  );
}
