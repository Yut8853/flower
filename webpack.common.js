const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const isProduction = process.env.NODE_ENV === 'production';
const enabledSourceMap = !isProduction;

module.exports = {
  entry: {
    app: './src/index.js',
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      title: 'Production',
      template: './src/index.html',
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
          {
            loader: MiniCssExtractPlugin.loader
          },
          // CSSをバンドルするための機能
          {
            loader: "css-loader",
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: false,
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,

              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2
            }
          },
          {
            loader: "sass-loader",
            options: {
              // ソースマップの利用有無
              sourceMap: enabledSourceMap
            },
          },
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
        test: /\.(png|jpg|jpeg|gif)$/i,
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
      // フォントファイルの処理
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',

      },
    ],
  },
  // ES5(IE11等)向けの指定（webpack 5以上で必要）
  target: ["web", "es5"],
};
