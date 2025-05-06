import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'OpenAssistant',
  tagline: 'Transform your web applications into AI-powered applications',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://openassistant-doc.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'GeoDaCenter',
  projectName: 'openassistant',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // scripts: [
  //   {
  //     src: 'https://cdnjs.cloudflare.com/ajax/libs/process/0.11.10/process.min.js',
  //   },
  // ],

  // Correct webpack configuration syntax for Docusaurus
  // clientModules: [require.resolve('./src/client-modules/webpack-fallback.ts')],
  plugins: [
    './plugins/readme-to-intro',
    './plugins/ui-readme-to-docs',
    './plugins/keplergl-readme-to-docs',
    './plugins/echarts-readme-to-docs',
    './plugins/geoda-readme-to-docs',
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'common',
        entryPoints: ['../packages/common/src/index.ts'],
        tsconfig: '../packages/common/tsconfig.json',
        out: 'docs/common',
        watch: false,
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'core',
        entryPoints: ['../packages/core/src/index.ts'],
        tsconfig: '../packages/core/tsconfig.json',
        out: 'docs/core',
        watch: false,
        excludePrivate: true,
        excludeInternal: true,
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'echarts',
        entryPoints: ['../packages/echarts/src/index.ts'],
        tsconfig: '../packages/echarts/tsconfig.json',
        out: 'docs/echarts',
        watch: false,
        excludePrivate: true,
        excludeInternal: true,
        name: 'simple',
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'geoda',
        entryPoints: ['../packages/geoda/src/index.ts'],
        tsconfig: '../packages/geoda/tsconfig.json',
        out: 'docs/geoda',
        watch: false,
        excludePrivate: true,
        excludeInternal: true,
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'ui',
        entryPoints: ['../packages/ui/src/index.ts'],
        tsconfig: '../packages/ui/tsconfig.json',
        out: 'docs/ui',
        watch: false,
        excludePrivate: true,
        excludeInternal: true,
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'duckdb',
        entryPoints: ['../packages/duckdb/src/index.ts'],
        tsconfig: '../packages/duckdb/tsconfig.json',
        out: 'docs/duckdb',
        watch: false,
        excludePrivate: true,
        excludeInternal: true,
      },
    ],
    [
      'docusaurus-plugin-typedoc',
      {
        id: 'osm',
        entryPoints: ['../packages/osm/src/index.ts'],
        tsconfig: '../packages/osm/tsconfig.json',
        out: 'docs/osm',
        watch: false,
        excludePrivate: true,
        excludeInternal: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/GeoDaCenter/openassistant/tree/main/website/docs',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/GeoDaCenter/openassistant/tree/main/website/docs',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'OpenAssistant',
      logo: {
        alt: 'OpenAssistant Logo',
        src: 'img/openassistant_log.jpeg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/GeoDaCenter/openassistant',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/openassistant',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/openassistant',
            },
            {
              label: 'X',
              href: 'https://x.com/openassistant',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/GeoDaCenter/openassistant',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Xun Li <lixun910@gmail.com>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
