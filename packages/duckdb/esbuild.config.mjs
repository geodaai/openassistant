// duckdb/esbuild.config.mjs
import {
  createBaseConfig,
  createDevServer,
  createWatchMode,
  buildFormat,
} from '../../esbuild.config.mjs';
import tailwindPlugin from 'esbuild-plugin-tailwindcss';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

const baseConfig = createBaseConfig({
  minify: false,
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
  plugins: [
    tailwindPlugin({
      config: './tailwind.config.js',
    }),
    dtsPlugin(),
  ],
  external: [
    'react',
    'react-dom',
    '@duckdb/duckdb-wasm',
    'apache-arrow',
    '@openassistant/core',
    '@nextui-org/react',
    'framer-motion',
    'tailwindcss',
  ],
});

if (process.argv.includes('--watch')) {
  createWatchMode(baseConfig).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

const isStart = process.argv.includes('--start');

if (isStart) {
  createDevServer(baseConfig, 3002).catch((e) => {
    console.error(e);
    process.exit(1);
  });
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
