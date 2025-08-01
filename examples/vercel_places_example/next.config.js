// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

const bundleAnalyzer = require('@next/bundle-analyzer');
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  // for some reason, the dnd-kit (used by kepler.gl) is included in the bundle?!
  transpilePackages: ['@dnd-kit/core', '@dnd-kit/sortable'],
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

    // Make @dnd-kit and @kepler.gl/components client-side only by liasing them to a dummy module on the server side
    // Make vega-canvas client-side only by aliasing it to a dummy module on the server side
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@dnd-kit/core': false,
        '@dnd-kit/sortable': false,
        '@dnd-kit/utilities': false,
        '@kepler.gl/components': false,
        '@kepler.gl/processors': false,
        '@kepler.gl/constants': false,
        '@kepler.gl/utils': false,
        '@kepler.gl/layers': false,
        '@kepler.gl/effects': false,
        '@kepler.gl/table': false,
        '@kepler.gl/deckgl-layers': false,
        '@kepler.gl/reducers': false,
        '@kepler.gl/styles': false,
        '@kepler.gl/types': false,
        '@kepler.gl/actions': false,
        vega: false,
        'react-leaflet': false,
        leaflet: false,
        'd3-color': false,
        'd3-interpolate': false,
        'd3-scale-chromatic': false,
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
