// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  createBaseConfig,
  buildFormat,
  createWatchMode,
} from '../../../esbuild.config.mjs';
import tailwindPlugin from 'esbuild-plugin-tailwindcss';

const isStart = process.argv.includes('--start');
const isWatch = process.argv.includes('--watch');

const baseConfig = createBaseConfig({
  entryPoints: ['src/index.ts'],
  external: [
    'react',
    'react-dom',
    'reactflow',
    'clsx',
    'tailwindcss',
    'zod',
    'zod-to-json-schema',
    '@openassistant/utils',
    '@openassistant/duckdb',
    '@openassistant/geoda',
    '@openassistant/h3',
    '@openassistant/map',
    '@openassistant/osm',
    '@openassistant/places',
    '@openassistant/plots',
  ],
  loader: {
    '.js': 'jsx',
    '.ts': 'tsx',
    '.css': 'css',
    '.svg': 'file',
    '.png': 'file',
  },
  jsx: 'automatic',
  plugins: [
    tailwindPlugin({
      config: './tailwind.config.js',
    }),
  ],
  define: {
    'process.env.NODE_ENV': isStart ? '"development"' : '"production"',
  },
  mainFields: ['module', 'main'],
  resolveExtensions: ['.js', '.jsx', '.ts', '.tsx'],
  nodePaths: ['node_modules'],
});

if (isWatch) {
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

  await createWatchMode(esmConfig);
  await createWatchMode(cjsConfig);
} else {
  Promise.all([
    buildFormat(baseConfig, 'esm', 'dist/index.esm.js'),
    buildFormat(baseConfig, 'cjs', 'dist/index.cjs.js'),
  ]).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
