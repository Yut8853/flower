const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map', // 開発環境向けのソースマップ設定

  // 出力設定の修正
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'), // 出力先を 'dist' に設定
    publicPath: '/', // ベースURLをルートに設定
  },

  // 開発サーバー設定の修正
  devServer: {
    static: {
      directory: path.join(__dirname, 'src'), // 静的ファイルのディレクトリを 'src' に設定
    },
    // その他の設定...
  }
});
