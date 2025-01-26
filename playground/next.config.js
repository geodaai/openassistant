const path = require('path');

module.exports = {
  eslint: {
    dirs: ['components', 'app'],
  },
  env: {
    OPENAI_TOKEN: process.env.OPENAI_TOKEN,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@openassistant/ui', '@openassistant/core'],
  webpack: (config) => {
    // Support WASM modules for duckdb
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    };
    config.module.rules.push({
      test: /\.wasm/,
      type: 'asset/resource',
      // type: 'webassembly/async'
      generator: {
        // specify the output location of the wasm files
        filename: 'static/[name][ext]',
      },
    });
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': './components',
      '@app': './app',
      'styled-components': path.resolve(
        __dirname,
        'node_modules/styled-components'
      ),
      // Only add @openassistant/common alias when running with --local flag
      ...(process.env.LOCAL === 'true' && {
        'apache-arrow': path.resolve(__dirname, 'node_modules/apache-arrow'),
        '@openassistant/common': path.resolve(
          __dirname,
          '../packages/common/src'
        ),
        '@openassistant/core': path.resolve(__dirname, '../packages/core/src'),
        '@openassistant/ui': path.resolve(__dirname, '../packages/ui/src'),
        '@openassistant/echarts': path.resolve(
          __dirname,
          '../packages/echarts/src'
        ),
        '@openassistant/duckdb': path.resolve(
          __dirname,
          '../packages/duckdb/src'
        ),
        '@openassistant/geoda': path.resolve(
          __dirname,
          '../packages/geoda/src'
        ),
      }),
      // react: path.resolve(__dirname, 'node_modules/react'),
      // 'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    };

    // Add externals configuration, so Next.js won't bundle them
    // config.externals = [
    //   ...config.externals,
    //   '@loaders.gl/draco',
    //   '@loaders.gl/worker-utils'
    // ];

    return config;
  },
};
