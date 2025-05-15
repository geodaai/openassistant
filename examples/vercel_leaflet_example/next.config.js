const bundleAnalyzer = require('@next/bundle-analyzer');
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  transpilePackages: [
    '@dnd-kit/core',
    '@dnd-kit/sortable',
    '@dnd-kit/utilities',
    'd3-color',
    '@kepler.gl/components',
    '@kepler.gl/utils',
    'leaflet',
    'react-leaflet',
  ],
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

    // Make @dnd-kit and @kepler.gl/components client-side only
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@dnd-kit/core': false,
        '@dnd-kit/sortable': false,
        '@dnd-kit/utilities': false,
        '@kepler.gl/components': false,
        vega: false,
        'react-leaflet': false,
        leaflet: false,
        'd3-color': false,
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
