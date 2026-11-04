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
    port: 3000,
    open: false, 
    host: '0.0.0.0', 
    allowedHosts: [
      'track-finch-graves.ngrok-free.dev'
    ]
  }, 
});
