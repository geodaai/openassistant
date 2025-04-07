import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss';
import { stylePlugin } from 'esbuild-style-plugin';
import { open } from 'open';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.argv.includes('--start');

const config = {
  entryPoints: [path.join(__dirname, 'src/main.tsx')],
  bundle: true,
  outdir: path.join(__dirname, 'build'),
  minify: !isDev,
  sourcemap: isDev,
  target: ['es2020'],
  format: 'esm',
  platform: 'browser',
  plugins: [
    tailwindPlugin({
      tailwindConfig: path.join(__dirname, 'tailwind.config.js'),
    }),
    stylePlugin(),
  ],
};

if (isDev) {
  const ctx = await esbuild.context(config);
  await ctx.watch();
  await ctx.serve({
    servedir: path.join(__dirname, 'build'),
    port: 3000,
  });
  await open('http://localhost:3000');
} else {
  await esbuild.build(config);
} 