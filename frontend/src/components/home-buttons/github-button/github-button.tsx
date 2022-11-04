import { component$ } from '@builder.io/qwik';
import { GithubButtonType } from './constants';
import { getIcon, hrefBuilder } from './utils';

export interface GithubButtonProps {
  type: keyof typeof GithubButtonType;
  user: string;
  repo: string;
  label?: string;
  href?: string;
  defaultIcon?: boolean;
  isLarge?: boolean;
  showCount?: boolean;
  ariaLabel?: string;
}

export const GithubButton = component$((props: GithubButtonProps) => {
  const getAttributes = () => {
    return {
      href: hrefBuilder(GithubButtonType[props.type], props.user, props.repo),
      'data-size': props.isLarge ? 'large' : '',
      'data-show-count': `${props.showCount ?? false}`,
      'data-icon': props.defaultIcon ? '' : getIcon(GithubButtonType[props.type]),
      'aria-label': props.ariaLabel ?? '',
    };
  };
  return (
    <a className="github-button" {...getAttributes()}>
      {' '}
      {props.label ?? ''}
    </a>
  );
});
