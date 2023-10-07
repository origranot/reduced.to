const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Reduced.to',
  staticDirectories: ['apps/docs/public', 'apps/docs/static'],
  tagline: "Reduced.to is a modern web application that reduces the length of link URL, so it's easier to remember, share and track.",
  favicon: 'images/favicon.png',
  url: 'https://reduced.to/',
  baseUrl: '/',
  projectName: 'reduced.to',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl: '/',
          path: 'apps/docs/docs',
        },
        pages: {
          path: 'apps/docs/src/pages',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'Reduced.to Logo',
          src: `images/logo.svg`,
          //srcDark: `img/logo.svg`,
          href: 'https://reduced.to',
          target: '_self',
        },
        items: [
          {
            type: 'search',
            position: 'right',
          },
          {
            position: 'right',
            href: 'https://reduced.to',
            label: 'Visit App',
          },

          {
            position: 'right',
            href: 'https://github.com/origranot/reduced.to',
            html: `
                <a  aria-label="GitHub" class="navbar-github-link">
                  <img src="images/github-logo.png" alt="GitHub Logo" class="navbar-github-logo" />
                </a>
              `,
          },
        ],
      },
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()} Reduced.to, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
