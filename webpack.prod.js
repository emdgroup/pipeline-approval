const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'nosources-source-map',
  mode: 'production',
  plugins: [
    // Define the NODE_ENV variable to make sure that scripts can actually match against it.
    // Refer to: https://webpack.js.org/guides/production/#specify-the-environment
    new webpack.DefinePlugin({
      DEVELOPMENT: false,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
});
