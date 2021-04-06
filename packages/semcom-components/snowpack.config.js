module.exports = {
  buildOptions: {
    out: "dist"
  },
  optimize: {
    target: 'es2015',
  },
  plugins: [
    '@snowpack/plugin-typescript',
  ]
};
