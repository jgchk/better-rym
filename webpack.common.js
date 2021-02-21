const path = require('path')
const { CleanWebpackPlugin: CleanPlugin } = require('clean-webpack-plugin')
const DotEnv = require('dotenv-webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { manifestEntries, ExtensionManifestPlugin } = require('./webpack.utils')

module.exports = (mode) => {
  const isProduction = mode === 'production'
  const isDevelopment = !isProduction

  return {
    mode,
    entry: manifestEntries,
    output: {
      path: path.resolve(__dirname, 'output'),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.svg$/,
          use: {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: {
                  removeViewBox: false,
                },
              },
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
      },
    },
    plugins: [
      new CleanPlugin(),
      new DotEnv(),
      new MiniCssExtractPlugin({ filename: '[name].css' }),
      ExtensionManifestPlugin({ isDevelopment }),
    ],
  }
}
