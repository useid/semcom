import path from 'path';
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'lib',
  build: {
      target: 'es2015',
      lib: {
          entry: path.resolve(__dirname, 'lib/index.ts'),
          name: '@useid/semcom-upload-component'
      },
      outDir: '../dist'
  }
});