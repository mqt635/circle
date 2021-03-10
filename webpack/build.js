const path = require('path');
const config = require('./config.json');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin =  require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { getHTMLPlugins, getOutput, getCopyPlugins, getZipPlugin, getEntry, getFirefoxCopyPlugins } = require('./utils');

const generalConfig = {
  mode: 'production',
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    rules: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      resolve: {
        extensions: ['.js', '.jsx']
      },
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        }
      },
    },{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        }
      }, 'eslint-loader'],
    },
    {
      test: /\.(css|less)$/,
      use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled:true
          }
        }
      }],
    },
  ]},
  resolve: {
    alias: {
      src: path.resolve(__dirname, `${config.chromePath}/`),
    },
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          ecma: 6,
          compress: true,
          output: {
            comments: false,
            beautify: false
          }
        },
        parallel: true,
        extractComments: false,
      })
    ]
  }
};

module.exports = [
  {
    ...generalConfig,
    output: getOutput('chrome', config.tempDirectory),
    entry: getEntry(config.chromePath, config.tempDirectory),
    plugins: [
      new CleanWebpackPlugin(),
      ...getHTMLPlugins('chrome', config.tempDirectory, config.chromePath),
      ...getCopyPlugins('chrome', config.tempDirectory, config.chromePath),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      getZipPlugin('chrome', config.distDirectory),
    ],
  },
  {
    ...generalConfig,
    output: getOutput('opera', config.tempDirectory),
    entry: getEntry(config.operaPath, config.tempDirectory),
    plugins: [
      new CleanWebpackPlugin(),
      ...getHTMLPlugins('opera', config.tempDirectory, config.operaPath),
      ...getCopyPlugins('opera', config.tempDirectory, config.operaPath),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      getZipPlugin('opera', config.distDirectory),
    ],
  },
  {
    ...generalConfig,
    output: getOutput('firefox', config.tempDirectory),
    entry: getEntry(config.firefoxPath, config.tempDirectory),
    plugins: [
      new CleanWebpackPlugin(),
      ...getHTMLPlugins('firefox', config.tempDirectory, config.firefoxPath),
      ...getFirefoxCopyPlugins('firefox', config.tempDirectory, config.firefoxPath),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      getZipPlugin('firefox', config.distDirectory),
    ],
  },
];
