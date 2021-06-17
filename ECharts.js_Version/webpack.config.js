//const webpack = require('webpack'); //to access built-in plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: './js/mainSetting.js',
  watch: true,
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: "bundle.js",
    chunkFilename: '[name].js'
  },
  resolve: {
    alias: {
      'jquery-ui': 'jquery-ui-dist/jquery-ui.min.js',
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
      use: [
    { loader: 'style-loader'},
    { loader: 'css-loader' }
      ]
      },
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    // new config.optimization.minimize()
  ]
};