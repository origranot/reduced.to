import { GithubButtonType } from './constants';

export const hrefBuilder = (type: GithubButtonType, username: string, repository: string) => {
  switch (type) {
    case GithubButtonType.Follow:
      return `https://github.com/${username}`;
    case GithubButtonType.Sponsor:
      return `https://github.com/sponsors/${username}`;
    case GithubButtonType.Watch:
      return `https://github.com/${username}/${repository}/subscription`;
    case GithubButtonType.Star:
      return `https://github.com/${username}/${repository}`;
    case GithubButtonType.Fork:
      return `https://github.com/${username}/${repository}/fork`;
    case GithubButtonType.Issue:
      return `https://github.com/${username}/${repository}/issues`;
    case GithubButtonType.Discuss:
      return `https://github.com/${username}/${repository}/discussions`;
    case GithubButtonType.Download:
      return `https://github.com/${username}/${repository}/archive/HEAD.zip`;
    case GithubButtonType.Install:
      return `https://github.com/${username}/${repository}/packages`;
    case GithubButtonType.Template:
      return `https://github.com/${username}/${repository}/generate`;
    case GithubButtonType.Actions:
      return `https://github.com/${username}/${repository}`;
  }
};

export const getIcon = (type: GithubButtonType) => {
  switch (type) {
    case GithubButtonType.Sponsor:
      return 'octicon-heart';
    case GithubButtonType.Watch:
      return 'octicon-eye';
    case GithubButtonType.Star:
      return 'octicon-star';
    case GithubButtonType.Fork:
      return 'octicon-repo-forked';
    case GithubButtonType.Issue:
      return 'octicon-issue-opened';
    case GithubButtonType.Discuss:
      return 'octicon-comment-discussion';
    case GithubButtonType.Download:
      return 'octicon-download';
    case GithubButtonType.Install:
      return 'octicon-package';
    case GithubButtonType.Template:
      return 'octicon-repo-template';
    case GithubButtonType.Actions:
      return 'octicon-play';
    default:
      return '';
  }
};
