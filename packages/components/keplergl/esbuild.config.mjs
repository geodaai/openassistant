import {
  createBaseConfig,
  buildFormat,
  createWatchMode,
} from '../../../esbuild.config.mjs';
import { dtsPlugin } from 'esbuild-plugin-d.ts';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

const isWatch = process.argv.includes('--watch');

const baseConfig = createBaseConfig({
  minify: false,
  sourcemap: true,
  entryPoints: ['src/index.ts'],
  loader: {
    '.js': 'jsx',
    '.ts': 'tsx',
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
    '.css': 'css',
  },
  jsx: 'automatic',
  minify: false,
  plugins: [dtsPlugin(), polyfillNode()],
  external: [
    'apache-arrow',
    'react',
    'react-dom',
    'react-intl',
    'react-palm',
    'react-redux',
    'redux',
    'redux-logger',
    'react-virtualized-auto-sizer',
    'styled-components',
    'use-sync-external-store',
    'hoist-non-react-statics',
    '@kepler.gl/actions',
    '@kepler.gl/components',
    '@kepler.gl/constants',
    '@kepler.gl/layers',
    '@kepler.gl/localization',
    '@kepler.gl/reducers',
    '@kepler.gl/processors',
    '@kepler.gl/styles',
    '@kepler.gl/types',
    '@kepler.gl/utils',
    '@loaders.gl/core',
    '@loaders.gl/schema',
    '@jspm/core',
  ],
  treeShaking: true,
});

if (isWatch) {
  // Create watch mode for both ESM and CJS formats
  const esmConfig = {
    ...baseConfig,
    format: 'esm',
    outfile: 'dist/index.esm.js',
  };
  const cjsConfig = {
    ...baseConfig,
    format: 'cjs',
    outfile: 'dist/index.cjs.js',
    platform: 'node',
    target: ['es2017'],
  };

  // Start watching both formats
  await createWatchMode(esmConfig);
  await createWatchMode(cjsConfig);
} else {
  // Build all formats
  Promise.all([
    buildFormat(baseConfig, 'esm', 'dist/index.esm.js'),
    buildFormat(baseConfig, 'cjs', 'dist/index.cjs.js'),
  ]).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
