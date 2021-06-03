import path from 'path';
import { defineConfig } from 'vite'

export default ({ command, mode }) => {
  if (command === 'serve') {
    return defineConfig({
      root: 'lib',
      build: {
        target: 'es2015',
        outDir: '../dist'
      },
      define: {
        'process.env.NODE_DEBUG': undefined
      },
      server: {
        port: 8080,
      }
    })
  } else {
    return defineConfig({
      root: 'lib',
      build: {
        target: 'es2015',
        lib: {
          entry: path.resolve(__dirname, 'lib/index.ts'),
          name: '@digita-ai/semcom-components'
        },
        outDir: '../dist'
      },
      define: {
        'process.env.NODE_DEBUG': undefined
      },
    })
  }
}