module.exports = {
  buildOptions: {
    out: "dist"
  },
  optimize: {
    //bundle: true,
    target: 'es2017',
  },
  plugins: [
    '@snowpack/plugin-typescript',
    //'@snowpack/plugin-webpack',
    // {
    //   extendConfig: (config) => {
    //     config.module.rules.push({
    //       exclude: [
    //         './index.js',
    //         './index.ts'
    //       ]
    //     });
    //     return config;
    //   },
    // },
  ]
};
