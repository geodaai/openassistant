// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import esbuild from 'esbuild';
import tailwindcss from 'esbuild-plugin-tailwindcss';
import open from 'open';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const isDev = process.argv.includes('--start');
const port = 3002;

const config = {
  entryPoints: ['src/main.tsx'],
  bundle: true,
  outfile: 'dist/main.js',
  platform: 'browser',
  minify: !isDev,
  sourcemap: isDev,
  loader: {
    '.svg': 'file',
    '.png': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.gif': 'file',
    '.ico': 'file',
    '.webp': 'file',
    '.css': 'css',
  },
  plugins: [
    polyfillNode(),
    tailwindcss({
      config: './tailwind.config.js',
    }),
  ],
  define: {
    'process.env.OPENAI_API_KEY': JSON.stringify(
      process.env.OPENAI_API_KEY || ''
    ),
    'process.env.MAPBOX_TOKEN': JSON.stringify(process.env.MAPBOX_TOKEN || ''),
  },
};

if (isDev) {
  const ctx = await esbuild.context({
    ...config,
    minify: false,
    sourcemap: true,
    banner: {
      js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`,
    },
  });
  await ctx.watch();
  await ctx.serve({
    servedir: '.',
    port,
    fallback: 'index.html',
    onRequest: ({ remoteAddress, method, path, status, timeInMS }) => {
      console.info(
        remoteAddress,
        status,
        `"${method} ${path}" [${timeInMS}ms]`
      );
    },
  });
  console.info(
    `Development server running at http://localhost:${port}, press Ctrl+C to stop`
  );
  await open(`http://localhost:${port}`);
} else {
  await esbuild.build(config);
}
