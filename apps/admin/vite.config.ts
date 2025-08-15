import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	server: {
		port: 5175,
		strictPort: true,
		proxy: {
			'/auth': 'http://localhost:4000',
			'/admin': 'http://localhost:4000',
			'/users': 'http://localhost:4000',
			'/products': 'http://localhost:4000',
			'/docs': 'http://localhost:4000',
		},
	},
	resolve: {
		alias: {
			'@packages/ui': path.resolve(__dirname, '../../packages/ui/src'),
			'@core': path.resolve(__dirname, '../../packages/core/src'),
			'@api': path.resolve(__dirname, '../../packages/api/src'),
		},
	},
});
