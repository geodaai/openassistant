import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'zustand',
      'use-sync-external-store',
      'use-sync-external-store/shim',
      'use-sync-external-store/shim/index.js',
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


