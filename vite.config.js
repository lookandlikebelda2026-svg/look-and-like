import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // envDir: './src',
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173                                                                             ,
    open: false, 
    host: '0.0.0.0', 
    allowedHosts: [
      'track-finch-graves.ngrok-free.dev'
    ],
    proxy: {
      '/api/imagekit': {
        target: 'https://api.imagekit.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/imagekit/, ''),
      },
    },
  }, 
});
