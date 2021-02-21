const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const CopyPlugin = require('copy-webpack-plugin')
const ExtensionReloader = require('webpack-extension-reloader')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from:
            './.yarn/unplugged/**/node_modules/webextension-polyfill/dist/browser-polyfill.js',
          to: 'browser-polyfill.js',
        },
        {
          from:
            './.yarn/unplugged/**/node_modules/webextension-polyfill/dist/browser-polyfill.js.map',
          to: 'browser-polyfill.js.map',
        },
      ],
    }),
    new ExtensionReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        contentScript: ['release', 'import'],
        background: 'background',
      },
    }),
  ],
})
