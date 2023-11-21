const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map', // 開発環境向けのソースマップ設定
  // その他の開発環境特有の設定
  output: {
    path: path.resolve(__dirname, 'public')
  }
});
