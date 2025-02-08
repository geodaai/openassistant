import { createBaseConfig, buildFormat } from '../../esbuild.config.mjs';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

const baseConfig = createBaseConfig({
  entryPoints: ['src/index.ts'],
  external: [
    'react',
    '@ai-sdk/deepseek',
    '@ai-sdk/google',
    '@ai-sdk/openai',
    '@ai-sdk/xai',
    '@ai-sdk/react',
    '@ai-sdk/ui-utils',
    'ollama-ai-provider',
    'openai',
    'p-retry',
    'p-queue',
  ],
  plugins: [dtsPlugin()],
});

// Build all formats
Promise.all([
  buildFormat(baseConfig, 'esm', 'dist/index.esm.js'),
  buildFormat(baseConfig, 'cjs', 'dist/index.cjs.js'),
]).catch((error) => {
  console.error(error);
  process.exit(1);
});
