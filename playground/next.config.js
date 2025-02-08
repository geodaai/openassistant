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
  // transpilePackages: ['@openassistant/ui', '@openassistant/core'],
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      minimize: true,
    };

    // Support WASM modules for duckdb
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    };

    // Support WASM modules for parquet-wasm
    config.module.rules.push({
      test: /\.wasm$/,
      // type: 'webassembly/async',
      type: 'asset/resource',
      generator: {
        filename:
          process.env.NODE_ENV === 'production'
            ? 'server/app/[name][ext]'
            : 'server/vendor-chunks/[name][ext]',
      },
    });

    // Resolve aliases for different versions of dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      react$: path.resolve(__dirname, 'node_modules/react'),
      'react-dom$': path.resolve(__dirname, 'node_modules/react-dom'),
      'styled-components': path.resolve(
        __dirname,
        'node_modules/styled-components'
      ),
      'apache-arrow': path.resolve(__dirname, 'node_modules/apache-arrow'),
    };

    // Only add @openassistant/common alias when running with --local flag
    if (process.env.LOCAL === 'true') {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@openassistant/common': path.resolve(
          __dirname,
          '../packages/common/src'
        ),
        '@openassistant/ui': path.resolve(__dirname, '../packages/ui/src'),
        '@openassistant/core': path.resolve(__dirname, '../packages/core/src'),
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
      };
    }

    // Fix Critical dependency: the request of a dependency is an expression
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    // Add externals configuration, so Next.js won't bundle them
    config.externals = [...config.externals, 'wbg'];

    return config;
  },
};
