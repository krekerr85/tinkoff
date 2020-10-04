const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const cssnano = require('cssnano');

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction;
const outputDir = path.resolve(__dirname, './bin');
const srcDir = path.resolve(__dirname, './src');

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    cabinet: ["babel-polyfill", "./src/main.js"],
    //cabinet: ["babel-polyfill", "./src/cabinet/dummy.js"],
  },
  output: {
    path: outputDir,
    publicPath: '/cabinet',
    filename: '[name].[contenthash].js',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
        uglifyOptions: {
          mangle: true,
          comments: false,
        },
        exclude: [/\.min\.js$/gi] // skip pre-minified libs
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorOptions: {
          discardComments: {
            removeAll: true,
          },
          mergeRules: false,
        },
        canPrint: false,
      }),
    ]
  },
  module: {
    rules: [ 
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader'
          }
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'vue-style-loader',
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader', // Run post css actions
            options: {
              plugins: function () { // post css plugins, can be exported to postcss.config.js
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          },
          'sass-loader'
        ],
      }, 
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|webp)$/,
        loader: 'file-loader',
        exclude: /\/fonts/,
        options: {
          name: 'images/[name].[ext]',
          publicPath: '/cabinet'
        }
      },
      {
        test: /\.(eot|svg|ttf|woff)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
          publicPath: '/cabinet'
        }
      }
    ]
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules')],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    new FaviconsWebpackPlugin({
      logo:'./src/favicon.png',
      prefix: 'icons-[hash]/',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: './src/index.html',
      filename: 'index.html'
    }),
    new CopyPlugin([
      {from: 'demoIcons', to: './demoIcons'},
      {from: 'src/assets/fonts', to: './demoIcons/fonts'},
    ]),
  ]
};

if (isProduction) {
  //module.exports.devtool = '#source-map';

  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new CleanWebpackPlugin()
  ])
}
