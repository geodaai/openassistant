// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import * as esbuild from 'esbuild';
import open from 'open';
import path from 'path';
import tailwindPlugin from 'esbuild-plugin-tailwindcss';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.argv.includes('--start');

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
  define: {
    'process.env.OPENAI_API_KEY': JSON.stringify(
      process.env.OPENAI_API_KEY || ''
    ),
  },
  plugins: [
    tailwindPlugin({
      tailwindConfig: path.join(__dirname, 'tailwind.config.js'),
    }),
  ],
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
    port: 3003,
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
    `Development server running at http://localhost:3003, press Ctrl+C to stop`
  );
  await open('http://localhost:3003');
} else {
  await esbuild.build(config);
}
