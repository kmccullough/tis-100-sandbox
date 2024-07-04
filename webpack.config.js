const path = require('path');

const name = 'vendor';

const distPath = path.resolve(__dirname, 'dist');

const experiments = {
  outputModule: true,
  topLevelAwait: true,
};

const devConfig = {
  entry: `./src/${name}.js`,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env', ]
          },
        },
      },
    ]
  },
  stats: {
    colors: true,
  },
  devtool: 'source-map',
  mode: 'development',
  output: {
    path: distPath,
    filename: `${name}.js`,
    library: { type: 'module' },
  },
  experiments,
};

const prodConfig = {
  ...devConfig,
  mode: 'production',
  output: {
    path: distPath,
    filename: `${name}.min.js`,
    library: { type: 'module' },
  },
  experiments,
};

module.exports = [ devConfig, prodConfig ];
