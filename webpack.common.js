const path = require('path');
const HTML = require('html-webpack-plugin');
const webpack = require('webpack');

const { RELATIVE_PUBLIC_PATH } = process.env;

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: path.resolve(__dirname, 'src', 'index.jsx'),
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: RELATIVE_PUBLIC_PATH ? '' : '/',
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json', '.scss'],
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'src', 'lib'),
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, 'src'),
        enforce: 'pre',
        use: 'source-map-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true, // true outputs JSX tags
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HTML({
      minify: {
        minifyCSS: true,
        minifyJS: true,
        conservativeCollapse: true,
        collapseWhitespace: true,
      },
      filename: 'index.html',
      template: 'index.ejs',
    }),
    new webpack.ProvidePlugin({
      Promise: 'core-js/es6/promise',
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
    }),
  ],
  devServer: {
    historyApiFallback: {
      disableDotRule: true,
    },
  },
};
