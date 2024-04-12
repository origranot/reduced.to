import { JSX } from '@builder.io/qwik/jsx-runtime';

export type PlatformName = 'Twitter' | 'Facebook' | 'LinkedIn';
export interface SocialMediaPlatform {
  logo: JSX.Element;
  name: PlatformName;
}

export const socialMediaPlatforms: SocialMediaPlatform[] = [
  {
    logo: (
      <svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 dark:fill-gray-300"
      >
        <path
          stroke="#1DA1F2"
          d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66"
        ></path>
      </svg>
    ),
    name: 'Twitter',
  },
  {
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" width="1365.12" height="1365.12" viewBox="0 0 14222 14222" class="h-4 w-4">
        <circle cx="7111" cy="7112" r="7111" fill="#1977f3"></circle>
        <path
          fill="#fff"
          d="M9879 9168l315-2056H8222V5778c0-562 275-1111 1159-1111h897V2917s-814-139-1592-139c-1624 0-2686 984-2686 2767v1567H4194v2056h1806v4969c362 57 733 86 1111 86s749-30 1111-86V9168z"
        ></path>
      </svg>
    ),
    name: 'Facebook',
  },
  {
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="h-4 w-4">
        <path
          fill="#0077b5"
          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
        ></path>
      </svg>
    ),
    name: 'LinkedIn',
  },
];
