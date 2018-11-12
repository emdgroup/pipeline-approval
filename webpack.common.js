const path = require('path');
const HTML = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: ['whatwg-fetch', path.resolve(__dirname, 'src', 'index.jsx')],
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
  },
  resolve: {
    alias: {
      url: 'url-lite',
    },
    extensions: ['.jsx', '.js', '.json', '.scss'],
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
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
        use: ['babel-loader'],
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
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 50000,
    }),
    new webpack.ProvidePlugin({
      sjcl: 'sjcl/core/sjcl',
    }),
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
  ],
  devServer: {
    historyApiFallback: {
      disableDotRule: true,
    },
  },
};
