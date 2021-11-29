import path = require('path')
import { CleanWebpackPlugin as CleanPlugin } from 'clean-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import DotEnvironment from 'dotenv-webpack'
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Configuration, WebpackPluginInstance } from 'webpack'
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { merge } from 'webpack-merge'

import { browsers, browserslist } from './browserlist'
import {
  ExtensionManifestPlugin,
  manifestEntries,
} from './extension-manifest-plugin'

const isFirefox = browsers.length === 1 && browsers[0] === 'firefox'

const common = (mode: 'development' | 'production'): Configuration => {
  const isProduction = mode === 'production'
  const isDevelopment = !isProduction

  return {
    mode,
    entry: {
      ...manifestEntries,
      options: path.join(__dirname, '../src/options/index.tsx'),
    },
    output: {
      path: path.resolve(__dirname, '../output'),
    },
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
      new ForkTsCheckerPlugin({
        eslint: {
          enabled: true,
          files: './src/**/*.{ts,tsx,js,jsx}',
        },
      }),
      new CleanPlugin(),
      new DotEnvironment() as unknown as WebpackPluginInstance,
      new HtmlWebpackPlugin({
        filename: 'options.html',
        chunks: ['options'],
        ...(isFirefox
          ? {}
          : { template: path.join(__dirname, 'options-template.html') }), // use template which includes browser-polyfill.js for chrome
      }),
      ExtensionManifestPlugin({ isDevelopment, isFirefox }),
      new CopyPlugin({
        patterns: [{ from: './res/icons/*', to: '[name][ext]' }],
      }),
      // new BundleAnalyzerPlugin() as any,
    ],
  }
}

const development = merge<Configuration>(
  common('development'),
  {
    name: 'dev',
    watch: true,
    devtool: 'eval-cheap-module-source-map',
  },
  isFirefox
    ? {}
    : {
        plugins: [
          new CopyPlugin({
            patterns: [
              {
                from: './node_modules/webextension-polyfill/dist/browser-polyfill.js',
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
                from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
                to: 'browser-polyfill.js',
              },
            ],
          }),
        ],
      }
)

module.exports = [development, production]
