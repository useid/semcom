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
          name: '@digita-ai/semcom-components',
        },
        outDir: '../dist',
        assetsDir: '../lib/assets',
        rollupOptions: {
          input: {
            input: path.resolve(__dirname, 'lib/components/input/input.component.ts'),
            barcode: path.resolve(__dirname, 'lib/components/barcode/barcode.component.ts'),
            base: path.resolve(__dirname, 'lib/components/base/base.component.ts'),
            credential: path.resolve(__dirname, 'lib/components/profile/credential.component.ts'),
            payslip: path.resolve(__dirname, 'lib/components/payslip/payslip.component.ts'),
            profile: path.resolve(__dirname, 'lib/components/profile/profile.component.ts'),
            profileContact: path.resolve(__dirname, 'lib/components/profile/profile-contact.component.ts'),
            profileName: path.resolve(__dirname, 'lib/components/profile/profile-name.component.ts'),
            profilePayslip: path.resolve(__dirname, 'lib/components/profile/profile-payslip.component.ts'),
            gender: path.resolve(__dirname, 'lib/components/gender/gender.component.ts'),
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