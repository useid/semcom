import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
      target: 'es2015',
      outDir: '../dist',
  },
  server: {
    port: 4200,
  }
});
