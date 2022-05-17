import React, { forwardRef, ReactElement, Ref } from 'react';
import classNames from 'classnames';
import { ListCardMain } from './Card';
import { ElementPlaceholder } from '../ElementPlaceholder';
import classed from '../../lib/classed';
import { PlaceholderCardProps } from './PlaceholderCard';

const Text = classed(ElementPlaceholder, 'h-3 rounded-xl');

export const PlaceholderListNew = forwardRef(function PlaceholderListNew(
  { className, ...props }: PlaceholderCardProps,
  ref: Ref<HTMLElement>,
): ReactElement {
  return (
    <article
      aria-busy
      className={classNames(
        className,
        'flex items-start rounded-2xl bg-theme-post-disabled py-4 pl-4 pr-10',
      )}
      {...props}
      ref={ref}
    >
      <ListCardMain>
        <Text style={{ width: '90%' }} />
        <Text
          style={{
            width: '67%',
            marginTop: '0.75rem',
            marginBottom: '0.75rem',
          }}
        />
        <div className="flex items-center" style={{ width: '50%' }}>
          <ElementPlaceholder className="mr-4 w-6 h-6 rounded-full" />
          <Text style={{ width: '30%', height: '1rem' }} />
        </div>
      </ListCardMain>
    </article>
  );
});
