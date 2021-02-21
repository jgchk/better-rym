const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const ExtensionReloader = require('webpack-extension-reloader')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  plugins: [
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
