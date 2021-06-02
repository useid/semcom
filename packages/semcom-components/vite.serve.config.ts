import { defineConfig } from 'vite';

export default defineConfig({
  root: 'lib',
  mode: 'development',
  build: {
      target: 'es2015',
      outDir: '../dist',
  },
  server: {
    port: 3001,
  },
  define: {
    'process.env.NODE_DEBUG': undefined
  },
});
