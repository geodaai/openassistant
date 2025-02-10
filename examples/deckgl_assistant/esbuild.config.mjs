import esbuild from 'esbuild';
import open from 'open';
import fs from 'fs';
import tailwindPlugin from 'esbuild-plugin-tailwindcss';

const isStart = process.argv.includes('--start');
const port = 3003;

const config = {
  entryPoints: ['src/main.tsx'],
  bundle: true,
  outdir: 'build',
  minify: !isStart,
  sourcemap: isStart,
  metafile: true,
  platform: 'browser',
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
  },
  jsx: 'automatic',
  alias: {
    // make sure the same version of apache-arrow is used
    'apache-arrow': './node_modules/apache-arrow',
  },
  plugins: [
    tailwindPlugin({
      config: './tailwind.config.js',
    }),
  ],
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
