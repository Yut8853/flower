const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const isProduction = process.env.NODE_ENV === 'production';
const enabledSourceMap = !isProduction;

module.exports = {
  entry: {
    app: './src/index.js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      title: 'Production',
      template: './src/index.html',
      inject: true,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "src/assets",
          to: "assets",
        },
      ],
    }),
    new ImageminWebpWebpackPlugin({
      config: [{
        test: /\.(png|jpe?g)$/i, // 対象ファイル
        options: {
          quality: 75 // 画質
        }
      }]
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      // Sassファイルの読み込みとコンパイル
      {
        test: /\.(css|sass|scss)/, // 対象となるファイルの拡張子
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        //拡張子が.jsを検知した時
        test: /\.js/,
        //ただし、node_modules/配下のjsは除外する
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      // 画像ファイルの処理
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              // JPEGやPNGの最適化設定
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: true,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4,
              },
              // WebP形式への変換オプション
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      {
        test: /\.{glsl|frag|vert}$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },
      {
        test: /\.{glsl|frag|vert}$/,
        loader: 'glslify-loader',
        exclude: /node_modules/
      },
      // フォントファイルの処理
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',

      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        test: /\.css$/i,
      }),
    ],
  },
  // ES5(IE11等)向けの指定（webpack 5以上で必要）
  target: ["web", "es5"],
};
