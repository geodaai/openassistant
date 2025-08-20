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
  webpack: (config, { isServer }) => {
    config.optimization = {
      ...config.optimization,
      minimize: true,
    };

    // Support WASM modules for duckdb
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      // topLevelAwait: true,
    };

    // Support WASM modules for parquet-wasm
    config.module.rules.push({
      test: /\.wasm$/,
      // type: 'webassembly/async',
      type: 'asset/resource',
      generator: {
        filename: 'static/chunks/[name][ext]',
      },
    });

    // Make problematic packages client-side only during SSR
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@kepler.gl/processors': false,
      };
    }

    // Resolve aliases for different versions of dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      // react: path.resolve(__dirname, '../node_modules/react'),
      // 'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
      'styled-components': path.resolve(
        __dirname,
        '../node_modules/styled-components'
      ),
      'apache-arrow': path.resolve(__dirname, '../node_modules/apache-arrow'),
    };

    // Fix Critical dependency: the request of a dependency is an expression
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    // Configure webpack to ignore dynamic import failures for optional dependencies
    config.ignoreWarnings = [
      /Module not found: Can't resolve '@ai-sdk\/amazon-bedrock'/,
      /Module not found: Can't resolve '@ai-sdk\/anthropic'/,
      /Module not found: Can't resolve '@ai-sdk\/deepseek'/,
      /Module not found: Can't resolve '@ai-sdk\/google'/,
      /Module not found: Can't resolve '@ai-sdk\/xai'/,
      /Module not found: Can't resolve 'ollama-ai-provider-v2'/,
    ];

    // Try to skip bundling optional dependencies using a custom resolver
    const originalResolve = config.resolve;
    config.resolve = {
      ...originalResolve,
      fallback: {
        ...originalResolve?.fallback,
        '@ai-sdk/amazon-bedrock': false,
        '@ai-sdk/anthropic': false,
        '@ai-sdk/deepseek': false,
        '@ai-sdk/google': false,
        '@ai-sdk/xai': false,
        'ollama-ai-provider-v2': false,
      },
    };

    return config;
  },
};
