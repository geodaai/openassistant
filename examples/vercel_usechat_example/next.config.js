// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

const bundleAnalyzer = require('@next/bundle-analyzer');
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    // Add worker-loader configuration
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: {
        loader: 'worker-loader',
        options: {
          filename: 'static/[hash].worker.js',
          publicPath: '/_next/',
        },
      },
    });

    // Add wasm support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
     config.module.rules.push({
       test: /\.wasm/,
       type: 'asset/resource',
       // type: 'webassembly/async'
       generator: {
         // specify the output location of the wasm files
         filename: 'static/chunks/[name][ext]',
       },
     });

    return config;
  },
  experimental: {
    // optimizePackageImports: ['@openassistant/duckdb'],
  },
});
