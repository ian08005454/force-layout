const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
module.exports = {
  entry: './js/mainSetting.js',
  watch: false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "main.bundle.js",
  },
  devServer:{
    contentBase:path.join(__dirname, 'dist'),
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
    new HtmlWebpackPlugin({
      template:'./base.html',
      minify: false,
    })
  ]
};