import esbuild from 'esbuild';
import fs from 'fs';
import open from 'open';

// Shared utilities
export const openURL = (url) => {
  open(url).catch(() => {
    console.log(`Unable to open browser. Please visit ${url} manually.`);
  });
};

// Create base configuration factory
export const createBaseConfig = (options = {}) => {
  const isStart = process.argv.includes('--start');

  return {
    bundle: true,
    minify: !isStart,
    sourcemap: true,
    metafile: true,
    target: ['esnext'],
    format: 'esm',
    platform: 'neutral',
    mainFields: ['module', 'import', 'main'], // Prioritize ESM modules
    conditions: ['import', 'module'], // Ensure ESM resolution
    define: {
      'process.env.NODE_ENV': isStart ? '"development"' : '"production"',
      require: 'undefined', // Prevent dynamic requires
    },
    ...options,
  };
};

// Watch mode configuration factory
export const createWatchMode = async (config) => {
  const ctx = await esbuild.context(config);
  await ctx.watch();
  console.log('Watching for changes...');
  return ctx;
};

// Development server configuration factory
export const createDevServer = (config, port = 3001) => {
  return esbuild
    .context({
      ...config,
      outdir: 'build',
      minify: false,
      sourcemap: true,
      external: [],
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
    });
};

// Build function for different formats
export const buildFormat = async (config, format, outfile) => {
  const result = await esbuild.build({
    ...config,
    format,
    ...(format === 'cjs' ? { platform: 'node', target: ['es2017'] } : {}),
    define: {
      ...config.define,
      // Ensure consistent module loading behavior
      'import.meta.url': 'undefined',
    },
    ...(outfile ? { outfile } : {}),
  });

  const metaFile = outfile
    ? outfile.replace('.js', '.meta.json')
    : 'dist/meta.json';
  fs.writeFileSync(metaFile, JSON.stringify(result.metafile));
  console.log(`${format.toUpperCase()} build complete! ✨`);

  return result;
};
