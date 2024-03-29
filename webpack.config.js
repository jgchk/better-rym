const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const DotEnvironmentPlugin = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const webpack = require('webpack')
const { join } = require('path')
const packageInfo = require('./package.json')

/** @type {webpack.Configuration} */
const config = (env) => {
  const production = !!env.production
  return {
    watch: !production,
    mode: production ? 'production' : 'development',
    devtool: production ? undefined : 'eval-cheap-module-source-map',
    entry: {
      background: join(__dirname, './src/modules/background/index.ts'),
      content: join(__dirname, './src/index.ts'),
    },
    optimization: {
      minimize: production,
      minimizer: ['...', new CssMinimizerPlugin()],
    },
    output: {
      path: join(__dirname, './output'),
    },
    plugins: [
      new ForkTsCheckerPlugin(),
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx'],
      }),
      new CleanWebpackPlugin(),
      new DotEnvironmentPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './manifest.json',
            transform(content, absoluteFrom) {
              const jsonContent = JSON.parse(content.toString())
              if (!production) {
                jsonContent.content_security_policy =
                  "script-src 'self' 'unsafe-eval'; object-src 'self';"
                jsonContent.background.scripts.push('hot-reload.js')
              }
              jsonContent.description = packageInfo.description
              jsonContent.version = packageInfo.version
              return JSON.stringify(jsonContent, undefined, 2)
            },
          },
          ...(!production
            ? [
                {
                  from: './node_modules/crx-hotreload/hot-reload.js',
                  to: '[name][ext]',
                },
              ]
            : []),
          { from: './res/icons/*', to: '[name][ext]' },
          {
            from: production
              ? './node_modules/webextension-polyfill/dist/browser-polyfill.js'
              : './node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
            to: 'browser-polyfill.js',
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader', options: { insert: 'html' } },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                  exportLocalsConvention: 'camelCaseOnly',
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['postcss-nested', 'postcss-preset-env'],
                },
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  { name: 'removeUnusedNS' },
                  { name: 'removeEditorsNSData' },
                ],
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
  }
}

module.exports = config
