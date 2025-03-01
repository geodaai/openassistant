import esbuild from 'esbuild';
import open from 'open';
import fs from 'fs';
import tailwindPlugin from 'esbuild-plugin-tailwindcss';
import process from 'node:process';
import dotenv from 'dotenv';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

dotenv.config();

const isStart = process.argv.includes('--start');
const port = 3003;
console.log('isStart', isStart);
const config = {
  entryPoints: ['src/main.tsx'],
  bundle: true,
  outdir: 'build',
  minify: false,
  sourcemap: true,
  platform: 'browser',
  format: 'iife',
  logLevel: 'info',
  metafile: true,
  loader: {
    '.js': 'jsx',
    '.ts': 'tsx',
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
    '.css': 'css',
  },
  define: {
    'process.env.NODE_ENV': isStart ? '"development"' : '"production"',
    'process.env.OPENAI_TOKEN': JSON.stringify(process.env.OPENAI_TOKEN || ''),
  },
  jsx: 'automatic',
  plugins: [
    tailwindPlugin({
      config: './tailwind.config.js',
    }),
    polyfillNode(),
  ],
  alias: {
    react: './node_modules/react',
    'react-dom': './node_modules/react-dom',
    'styled-components': './node_modules/styled-components',
    'd3-request': './node_modules/d3-request',
    xmlhttprequest: './node_modules/xmlhttprequest',
  },
};

const openURL = (url) => {
  open(url).catch(() => {
    console.log(`Unable to open browser. Please visit ${url} manually.`);
  });
};

if (isStart) {
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
        servedir: 'build',
        port,
        fallback: 'build/index.html',
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
  // Production build
  esbuild
    .build(config)
    .then((result) => {
      fs.writeFileSync('meta.json', JSON.stringify(result.metafile));
      console.log('Build complete! ✨');
    })
    .catch(() => process.exit(1));
}
