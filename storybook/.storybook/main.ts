import type { StorybookConfig } from '@storybook/nextjs';

import path, { join, dirname } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    if (!config.resolve) config.resolve = {};

    const opentelemetryApiPath = path.resolve(
      process.cwd(),
      'node_modules/@opentelemetry/api'
    );
    console.log('opentelemetryApiPath', opentelemetryApiPath);
    config.resolve.alias = {
      ...config.resolve.alias,
      '@opentelemetry/api': opentelemetryApiPath,
    };
    return config;
  },
};

export default config;
