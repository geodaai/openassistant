// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

const bundleAnalyzer = require('@next/bundle-analyzer');
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  transpilePackages: [],
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    // Make @kepler.gl/processors client-side only
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@kepler.gl/processors': false,
        vega: false,
        'react-leaflet': false,
        leaflet: false,
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
      generator: {
        filename: 'static/chunks/[name][ext]',
      },
    });

    // This is to fix warnings about missing critical dependencies reported by loaders.gl using require()
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    return config;
  },
  experimental: {
    // optimizePackageImports: ['@openassistant/duckdb'],
  },
});
