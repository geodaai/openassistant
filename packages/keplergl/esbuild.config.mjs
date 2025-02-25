import { createBaseConfig, buildFormat } from '../../esbuild.config.mjs';
import { dtsPlugin } from 'esbuild-plugin-d.ts';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

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
    'react-palm',
    'react-redux',
    'redux',
    'styled-components',
    'use-sync-external-store',
    'hoist-non-react-statics',
    '@openassistant/core',
    '@openassistant/common',
    '@kepler.gl/actions',
    '@kepler.gl/components',
    '@kepler.gl/constants',
    '@kepler.gl/layers',
    '@kepler.gl/reducers',
    '@kepler.gl/processors',
    '@kepler.gl/styles',
    '@kepler.gl/utils',
    '@kepler.gl/localization',
  ],
  treeShaking: true,
});

// Build all formats
Promise.all([
  buildFormat(baseConfig, 'esm', 'dist/index.esm.js'),
  buildFormat(baseConfig, 'cjs', 'dist/index.cjs.js'),
]).catch((error) => {
  console.error(error);
  process.exit(1);
});
