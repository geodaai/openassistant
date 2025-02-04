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
    'ollama-ai-provider',
    'js-tiktoken',
    'openai',
    'zod',
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
