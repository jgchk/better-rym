const path = require('path')
const { CleanWebpackPlugin: CleanPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const DotEnv = require('dotenv-webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
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
    new CopyPlugin({ patterns: [{ from: './manifest.json' }] }),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
  ],
}
