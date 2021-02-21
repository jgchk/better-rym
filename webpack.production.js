const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const CssoWebpackPlugin = require('csso-webpack-plugin').default

module.exports = merge(common, {
  mode: 'production',
  plugins: [new CssoWebpackPlugin()],
})
