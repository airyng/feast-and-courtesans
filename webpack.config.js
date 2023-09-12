const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

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
    minimize: true,
    mangleWasmImports: true,
    mangleExports: 'size',
    removeAvailableModules: true,
    removeEmptyChunks: true,
    sideEffects: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        parse: {
          html5_comments: false,
        },
        compress: {
          keep_fargs: false
        },
        format: {
          wrap_iife: true
        },
        mangle: {},
        nameCache: {},
        sourceMap: false,
        toplevel: true,
      },
    })]
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
      // {
      //   test: /\.css$/i,
      //   use: ['style-loader', 'css-loader'],
      // },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ],
  },
};