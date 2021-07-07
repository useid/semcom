import path from 'path';
import { defineConfig } from 'vite'

export default ({ command, mode }) => {
  if (command === 'serve') {
    return defineConfig({
      root: 'dist',
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
          name: '@digita-ai/semcom-components',
        },
        outDir: '../dist',
        rollupOptions: {
          input: {
            input: path.resolve(__dirname, 'lib/components/input.component.ts'),
            payslip: path.resolve(__dirname, 'lib/components/payslip.component.ts'),
            profile: path.resolve(__dirname, 'lib/components/profile.component.ts'),
          },
          output: [
            {
              entryFileNames: ({ facadeModuleId }) => facadeModuleId.split('/').pop().replace('.ts', '.js'),
              format: 'esm',
              dir: path.resolve(__dirname, 'dist/components')
            },
          ],
        },
      },
      define: {
        'process.env.NODE_DEBUG': undefined
      },
    })
  }
}