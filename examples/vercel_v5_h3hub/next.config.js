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
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  publicRuntimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  webpack: (config, { dev, isServer }) => {
    // Enable source maps for development
    if (dev && !isServer) {
      config.devtool = 'eval-source-map';
    }
    
    // Configure source map resolution for workspace packages
    if (dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Map workspace packages to their source files for debugging
        '@openassistant/h3hub': require('path').resolve(__dirname, '../../packages/tools/h3hub/src'),
        '@openassistant/utils': require('path').resolve(__dirname, '../../packages/utils/src'),
        '@openassistant/osm': require('path').resolve(__dirname, '../../packages/tools/osm/src'),
      };
    }
    
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
