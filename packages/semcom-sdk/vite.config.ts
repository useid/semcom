import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'lib',
  mode: 'development',
  build: {
    minify: false,
      target: 'es2015',
      lib: {
          entry: path.resolve(__dirname, 'lib/index.ts'),
          name: '@digita-ai/semcom-sdk'
      },
      outDir: '../dist',
  },
  define: {
    'process.env.NODE_DEBUG': undefined
  },
});
