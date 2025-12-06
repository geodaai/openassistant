import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: [
      'zustand',
      'use-sync-external-store',
      'use-sync-external-store/shim',
      'use-sync-external-store/shim/index.js',
    ],
  },
});

