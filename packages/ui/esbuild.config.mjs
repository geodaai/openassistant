import {
  createBaseConfig,
  createDevServer,
  buildFormat,
} from '../../esbuild.config.mjs';
import tailwindPlugin from 'esbuild-plugin-tailwindcss';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

const baseConfig = createBaseConfig({
  entryPoints: ['src/index.ts'],
  jsx: 'automatic',
  plugins: [dtsPlugin()],
  external: [
    'react',
    'react-dom',
    '@ai-sdk',
    'html2canvas',
    '@openassistant/core',
    '@nextui-org',
  ],
  // alias: {
  //   '@openassistant/core': '../core/src/index.ts',
  // },
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
      config: './tailwind.config.js',
    }),
    dtsPlugin(),
  ],
  external: [
    'react',
    'react-dom',
    '@ai-sdk',
    'html2canvas',
    '@openassistant/core',
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
      config: './tailwind.config.js',
    }),
    dtsPlugin(),
  ],
};

const isStart = process.argv.includes('--start');

if (isStart) {
  createDevServer(serverConfig, 3001).catch((e) => {
    console.error(e);
    process.exit(1);
  });
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
