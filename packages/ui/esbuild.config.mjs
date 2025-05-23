import {
  createBaseConfig,
  createDevServer,
  createWatchMode,
  buildFormat,
} from '../../esbuild.config.mjs';
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss';
import { dtsPlugin } from 'esbuild-plugin-d.ts';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseConfig = createBaseConfig({
  entryPoints: ['src/index.ts'],
  jsx: 'automatic',
  plugins: [dtsPlugin()],
  external: [
    '@ai-sdk/ui-utils',
    '@heroui/react',
    '@heroui/use-clipboard',
    '@iconify/react',
    '@openassistant/core',
    '@openassistant/utils',
    'ai',
    'framer-motion',
    'html2canvas',
    'next-themes',
    'react-audio-voice-recorder',
    'react-markdown',
    'remark-gfm',
    'tailwindcss',
    'react',
    'react-dom',
  ],
});

const fullBundleConfig = {
  ...baseConfig,
  entryPoints: ['src/main.tsx'],
  loader: {
    '.js': 'jsx',
    '.ts': 'tsx',
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
    '.css': 'css',
  },
  plugins: [
    tailwindPlugin({
      tailwindConfig: path.join(__dirname, 'tailwind.config.js'),
    }),
    dtsPlugin(),
  ],
};

const serverConfig = {
  ...baseConfig,
  entryPoints: ['src/main.tsx'],
  loader: {
    '.js': 'jsx',
    '.ts': 'tsx',
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
    '.css': 'css',
    '.wasm': 'file',
  },
  alias: {
    react: '../../node_modules/react',
    'react-dom': '../../node_modules/react-dom',
  },
  plugins: [
    tailwindPlugin({
      tailwindConfig: path.join(__dirname, 'tailwind.config.js'),
    }),
    dtsPlugin(),
  ],
};

const isStart = process.argv.includes('--start');
const isWatch = process.argv.includes('--watch');

if (isStart) {
  createDevServer(serverConfig, 3001).catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else if (isWatch) {
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
    buildFormat(baseConfig, 'cjs', 'dist/index.cjs.js'),
    buildFormat(baseConfig, 'esm', 'dist/index.esm.js'),
    buildFormat(baseConfig, 'iife', 'dist/index.iife.js'),
    buildFormat(fullBundleConfig, 'esm', 'dist/bundle.js'),
  ]).catch((error) => {
    console.error(error);
    console.error('Failed to build UI package');
    process.exit(1);
  });
}
