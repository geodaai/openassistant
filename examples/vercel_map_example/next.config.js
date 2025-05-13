const bundleAnalyzer = require('@next/bundle-analyzer');
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: true,
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
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@dnd-kit/core':
          'next/dist/server/future/route-modules/app-page/vendored/contexts/amp-context',
        '@dnd-kit/sortable':
          'next/dist/server/future/route-modules/app-page/vendored/contexts/amp-context',
        '@kepler.gl/components':
          'next/dist/server/future/route-modules/app-page/vendored/contexts/amp-context',
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
