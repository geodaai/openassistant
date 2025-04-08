import {
  createBaseConfig,
  buildFormat,
  createWatchMode,
} from '../../esbuild.config.mjs';
import tailwindPlugin from 'esbuild-plugin-tailwindcss';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

const isWatch = process.argv.includes('--watch');

const baseConfig = createBaseConfig({
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
    '@openassistant/core',
    '@openassistant/common',
    '@openassistant/echarts',
    '@nextui-org/react',
    'framer-motion',
    'tailwindcss',
  ],
});

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
    buildFormat(baseConfig, 'esm', 'dist/index.esm.js'),
    buildFormat(baseConfig, 'cjs', 'dist/index.cjs.js'),
  ]).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
