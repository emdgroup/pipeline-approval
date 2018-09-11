const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_SESSION_TOKEN,
} = process.env;

module.exports = merge(common, {
  devtool: 'inline-cheap-module-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      DEVELOPMENT: true,
      RELATIVE_PUBLIC_PATH: false,
      AWS_ACCESS_KEY_ID: JSON.stringify(AWS_ACCESS_KEY_ID),
      AWS_SECRET_ACCESS_KEY: JSON.stringify(AWS_SECRET_ACCESS_KEY),
      AWS_SESSION_TOKEN: JSON.stringify(AWS_SESSION_TOKEN),
    }),
  ]
});
