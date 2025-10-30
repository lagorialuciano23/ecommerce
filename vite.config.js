import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7138',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log('Proxying:', path);
          return path;
        },
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
  plugins: [react()],
});