import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      /* options */
    }),
  ],
  resolve: {
    // Ensure that all consumers (our code and kepler.gl) share a single
    // instance of apache-arrow. This avoids instanceof/Data mismatches
    // inside ArrowDataContainer / Vector constructors.
    dedupe: ['apache-arrow'],
  },
  optimizeDeps: {
    include: [
      'zustand',
      'use-sync-external-store',
      'use-sync-external-store/shim',
      'use-sync-external-store/shim/index.js',
      // Pre-bundle apache-arrow so Vite uses a single copy everywhere.
      'apache-arrow',
    ],
  },
  // Disable sourcemaps to avoid Vite internal errors like
  // "Cannot read properties of undefined (reading 'map')" when combining sourcemaps.
  build: {
    sourcemap: false,
  },
  css: {
    devSourcemap: false,
  },
});
