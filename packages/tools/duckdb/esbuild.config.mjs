// duckdb/esbuild.config.mjs
import {
  createBaseConfig,
  createWatchMode,
  buildFormat,
} from '../../../esbuild.config.mjs';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

const baseConfig = createBaseConfig({
  minify: false,
  entryPoints: ['src/index.ts'],
  jsx: 'automatic',
  plugins: [dtsPlugin()],
  external: [
    'react',
    'react-dom',
    '@duckdb/duckdb-wasm',
    'apache-arrow',
    '@openassistant/utils',
    'zod',
  ],
});

const isWatch = process.argv.includes('--watch');

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
    buildFormat(baseConfig, 'cjs', 'dist/index.cjs.js'),
    buildFormat(baseConfig, 'esm', 'dist/index.esm.js'),
    buildFormat(baseConfig, 'iife', 'dist/index.iife.js'),
  ]).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
