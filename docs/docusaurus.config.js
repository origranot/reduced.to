// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Reduced.to',
  staticDirectories: ['public', 'static'],
  tagline: 'Highly Efficient Open Source URL Shortener',
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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          routeBasePath: '/',
          editUrl: '/',
        },

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
          href: '/',
          target: '_self',
        },
        items: [
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
