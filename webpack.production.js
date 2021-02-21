const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const CssoWebpackPlugin = require('csso-webpack-plugin').default
const CopyPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CssoWebpackPlugin(),
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
})
