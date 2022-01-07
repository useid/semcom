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
      alias: [
        { find:/^(.*)\.component\.js$/, replacement: '$1.component.ts' }
      ],
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
        target: 'es2020',
        lib: {
          entry: path.resolve(__dirname, 'lib/index.ts'),
          name: '@digita-ai/semcom-components',
        },
        outDir: '../dist',
        assetsDir: '../lib/assets',
        rollupOptions: {
          input: {
            input: path.resolve(__dirname, 'lib/components/input.component.ts'),
            base: path.resolve(__dirname, 'lib/components/base.component.ts'),
            document: path.resolve(__dirname, 'lib/components/document/document.component.ts'),
            payslip: path.resolve(__dirname, 'lib/components/payslip.component.ts'),
            profile: path.resolve(__dirname, 'lib/components/profile/profile.component.ts'),
            gender: path.resolve(__dirname, 'lib/components/gender.component.ts'),
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