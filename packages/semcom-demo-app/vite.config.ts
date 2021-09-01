import { defineConfig, loadEnv } from 'vite';

export default defineConfig( ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  // expose .env as process.env instead of import.meta since jest does not import meta yet
  const envWithProcessPrefix = Object.entries(env).reduce(
    (prev, [key, val]) => {
      return {
        ...prev,
        ['process.env.' + key]: `"${val}"`,
        ['process.env.DEV']: `"${command === 'serve'}"`,
        ['process.env.PROD']: `"${command === 'build'}"`,
        ['process.env.MODE']: command === 'build' ? `"PROD"` : `"DEV"`,
      }
    },
    {},
  );

  if (command === 'serve') {
      return {
        root: 'lib',
        server: {
          port: 4200,
        },
        mode: 'development',
        define: envWithProcessPrefix,
      }
  } else if (command === 'build'){
    return {
        root: 'lib',
        build: {
            target: 'es2015',
            outDir: '../dist',
        },
        server: {
          port: 4200,
        },
        mode: 'production',
        define: envWithProcessPrefix,
      }
  }
});