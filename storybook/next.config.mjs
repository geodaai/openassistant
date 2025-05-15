import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@openassistant/components': path.resolve(
        __dirname,
        '../packages/components/src/index.ts'
      ),
      '@openassistant/plots': path.resolve(
        __dirname,
        '../packages/plots/src/index.ts'
      ),
      '@openassistant/core': path.resolve(
        __dirname,
        '../packages/core/src/index.ts'
      ),
      '@openassistant/geoda': path.resolve(
        __dirname,
        '../packages/geoda/src/index.ts'
      ),
      '@openassistant/ui': path.resolve(
        __dirname,
        '../packages/ui/src/index.ts'
      ),
      '@openassistant/keplergl': path.resolve(
        __dirname,
        '../packages/keplergl/src/index.ts'
      ),
      // Force all styled-components imports to use the same instance
      'styled-components': path.resolve(
        __dirname,
        '../node_modules/styled-components'
      ),
    };

    // Add resolution for styled-components
    if (!config.resolve.extensions) {
      config.resolve.extensions = [];
    }
    config.resolve.extensions.push('.js', '.jsx', '.ts', '.tsx');

    return config;
  },
};

export default nextConfig;
