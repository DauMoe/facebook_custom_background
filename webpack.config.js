const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const banner = 
`// ==UserScript==
// @name         Facebook custom background
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Change background image with Base64 conversion
// @author       DauMoe
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525981/Facebook%20custom%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/525981/Facebook%20custom%20background.meta.js
// ==/UserScript==`;

module.exports = {
  entry: path.join(__dirname, 'index.js'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: banner,
      raw: true,
      entryOnly: true,
      stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};