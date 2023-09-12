const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    asyncChunks: false
  },
  optimization: {
    mergeDuplicateChunks: true,
    minimize: true
  },
  devServer: {
    static: {
        directory: path.resolve(__dirname, 'dist'),
    },
    open: true,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
        title: 'Feast and courtesans',
        template: 'index.html',
        filename: 'index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ],
  },
};