import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' — чтобы сайт открывался и на Vercel/Netlify, и на GitHub Pages (в подпапке)
export default defineConfig({
  plugins: [react()],
  base: './',
});
