import path = require('path')
import { CleanWebpackPlugin as CleanPlugin } from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import DotEnvironment from 'dotenv-webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { Configuration } from 'webpack'
import ExtensionReloader, {
  ExtensionReloader as ExtensionReloaderType,
} from 'webpack-extension-reloader'
import { merge } from 'webpack-merge'
import { browsers, browserslist } from './browserlist'
import {
  ExtensionManifestPlugin,
  manifestEntries,
} from './extension-manifest-plugin'

const isFirefox = browsers.length === 1 && browsers[0] === 'firefox'

const common = (mode: 'development' | 'production') => {
  const isProduction = mode === 'production'
  const isDevelopment = !isProduction

  return {
    mode,
    entry: manifestEntries,
    output: {
      path: path.resolve(__dirname, '../output'),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/env',
                  {
                    useBuiltIns: 'usage',
                    corejs: '3.8',
                    targets: browserslist,
                  },
                ],
                ['@babel/typescript', { jsxPragma: 'h' }],
              ],
              plugins: [
                [
                  '@babel/transform-react-jsx',
                  { runtime: 'automatic', importSource: 'preact' },
                ],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    'postcss-nested',
                    ['postcss-preset-env', { browsers: browserslist }],
                  ],
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
      new DotEnvironment(),
      new MiniCssExtractPlugin({ filename: '[name].css' }),
      ExtensionManifestPlugin({ isDevelopment, isFirefox }),
    ],
  }
}

const development = merge<Configuration>(
  common('development'),
  {
    name: 'dev',
    watch: true,
    devtool: 'eval-cheap-module-source-map',
    plugins: [
      new (ExtensionReloader as ExtensionReloaderType)({
        port: 9090,
        reloadPage: true,
        entries: {
          contentScript: ['release', 'import'],
          background: 'background',
        },
      }),
    ],
  },
  isFirefox
    ? {}
    : {
        plugins: [
          new CopyPlugin({
            patterns: [
              {
                from:
                  './.yarn/unplugged/**/node_modules/webextension-polyfill/dist/browser-polyfill.js',
                to: 'browser-polyfill.js',
              },
            ],
          }),
        ],
      }
)

const production = merge<Configuration>(
  common('production'),
  {
    name: 'prod',
    optimization: {
      minimize: true,
      minimizer: ['...', new CssMinimizerPlugin()],
    },
  },
  isFirefox
    ? {}
    : {
        plugins: [
          new CopyPlugin({
            patterns: [
              {
                from:
                  './.yarn/unplugged/**/node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
                to: 'browser-polyfill.js',
              },
            ],
          }),
        ],
      }
)

module.exports = [development, production]
