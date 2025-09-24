// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  createBaseConfig,
  buildFormat,
  createWatchMode,
} from '../../../esbuild.config.mjs';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

const isWatch = process.argv.includes('--watch');

const baseConfig = createBaseConfig({
  entryPoints: ['src/index.ts'],
  plugins: [dtsPlugin()],
  external: ['@openassistant/core', 'zod'],
  sourcemap: true, // Always generate source maps for debugging
  target: ['es2020'], // Use ES2020 to support BigInt literals
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
    target: ['es2020'],
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