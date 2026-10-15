import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps the build portable (GitHub Pages, Netlify, Vercel, any static host)
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { host: true, port: 5173 },
});
