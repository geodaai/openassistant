// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import * as esbuild from 'esbuild';
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.argv.includes('--start');
const port = 3006;

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
