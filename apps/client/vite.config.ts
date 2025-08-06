import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/test-banknot/' : '/',
  resolve: {
    alias: {
      '@packages/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@core': path.resolve(__dirname, '../../packages/core/src'),
      '@api': path.resolve(__dirname, '../../packages/api/src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
