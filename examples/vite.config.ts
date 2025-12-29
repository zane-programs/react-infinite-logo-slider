import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname),
  resolve: {
    alias: {
      'react-infinite-logo-slider': resolve(__dirname, '../src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
