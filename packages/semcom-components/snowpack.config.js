module.exports = {
  buildOptions: {
    out: "dist"
  },
  exclude: [
    '**/node_modules/**/*',
    '**/Dockerfile'
  ],
  optimize: {
    target: 'es2015',
  },
  plugins: [
    '@snowpack/plugin-typescript',
  ]
};
