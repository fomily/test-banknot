import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/test-banknot/' : '/',
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/auth': 'http://localhost:4000',
      '/users': 'http://localhost:4000',
      '/products': 'http://localhost:4000',
      '/docs': 'http://localhost:4000',
    },
  },
  resolve: {
    alias: {
      '@packages/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@api': path.resolve(__dirname, '../../packages/api/src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
