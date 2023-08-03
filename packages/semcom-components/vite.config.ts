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
        port: process.env.PORT ? parseInt(process.env.PORT) : 8080
      }
    })
  } else {
    return defineConfig({
      root: 'lib',
      build: {
        target: 'es2020',
        lib: {
          entry: path.resolve(__dirname, 'lib/index.ts'),
          name: '@useid/semcom-components',
        },
        outDir: '../dist',
        assetsDir: '../lib/assets',
        rollupOptions: {
          input: {
            input: path.resolve(__dirname, 'lib/components/input.component.ts'),
            base: path.resolve(__dirname, 'lib/components/base.component.ts'),
            document: path.resolve(__dirname, 'lib/components/document.component.ts'),
            barcode: path.resolve(__dirname, 'lib/components/barcode.component.ts'),
            credential: path.resolve(__dirname, 'lib/components/credential.component.ts'),
            payslip: path.resolve(__dirname, 'lib/components/payslip.component.ts'),
            profile: path.resolve(__dirname, 'lib/components/profile.component.ts'),
            profileContact: path.resolve(__dirname, 'lib/components/profile-contact.component.ts'),
            profileName: path.resolve(__dirname, 'lib/components/profile-name.component.ts'),
            profilePayslip: path.resolve(__dirname, 'lib/components/profile-payslip.component.ts'),
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