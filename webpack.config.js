const path = require('path')
const process = require('process')

const { CleanWebpackPlugin: CleanPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const DotEnv = require('dotenv-webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssoWebpackPlugin = require('csso-webpack-plugin').default

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction
const mode = isProduction ? 'production' : 'development'

module.exports = {
  mode,
  entry: {
    release: './src/release/index.tsx',
    import: './src/import/index.tsx',
    background: './src/background/index.ts',
  },
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
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: isDevelopment } },
          'postcss-loader',
        ],
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
    new CopyPlugin({ patterns: [{ from: './manifest.json' }] }),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new CssoWebpackPlugin(),
  ],
  devtool: isDevelopment && 'eval-cheap-module-source-map',
}
