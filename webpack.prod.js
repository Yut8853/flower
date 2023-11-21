const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');								//	追加
const path = require('path')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map', // 本番環境向けのソースマップ設定
  // その他の本番環境特有の設定
  output: {
    path: path.resolve(__dirname, './dist'), 
  },
  plugins: [
    new CleanWebpackPlugin(),
  ]
});
