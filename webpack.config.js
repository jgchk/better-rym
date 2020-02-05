const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackUserscript = require('webpack-userscript')
const dev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    filename: 'betterRYM.user.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackUserscript({
      headers: {
        name: 'BetterRYM',
        author: 'mocha',
        license: 'MIT',
        version: dev ? '[version]-build.[buildTime]' : '[version]',
        grant: ['GM_xmlhttpRequest'],
        connect: ['self', 'api.jake.cafe'],
        match: ['*://rateyourmusic.com/release/*', '*://rateyourmusic.com/releases/ac*'],
        require: [
          'https://code.jquery.com/jquery-3.4.1.slim.js',
          'https://connect.soundcloud.com/sdk/sdk-3.3.2.js'
        ]
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: 'svg-inline-loader?classPrefix'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
