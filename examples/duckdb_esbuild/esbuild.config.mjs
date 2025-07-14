// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import * as esbuild from 'esbuild';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.argv.includes('--start');
const port = 3000;

const config = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  platform: 'browser',
  outfile: 'dist/index.js',
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
  alias: {
    'apache-arrow': path.resolve(__dirname, '../../node_modules/apache-arrow'),
  },
};

const openURL = (url) => {
  open(url).catch(() => {
    console.log(`Unable to open browser. Please visit ${url} manually.`);
  });
};

if (isDev) {
  // Development server with hot reload
  esbuild
    .context({
      ...config,
      minify: false,
      sourcemap: true,
      banner: {
        js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`,
      },
    })
    .then(async (ctx) => {
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
      openURL(`http://localhost:${port}`);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
} else {
  esbuild.build(config).catch(() => process.exit(1));
}
