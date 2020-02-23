const path = require('path')
const WebpackUserscript = require('webpack-userscript')

const dev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'betterRYM.user.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  },
  plugins: [
    new WebpackUserscript({
      headers: {
        name: 'BetterRYM',
        author: 'mocha',
        license: 'GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt',
        version: dev ? '[version]-build.[buildTime]' : '[version]',
        grant: ['GM_xmlhttpRequest'],
        connect: ['self', 'jake.cafe'],
        match: [
          '*://rateyourmusic.com/release/*',
          '*://rateyourmusic.com/releases/ac*',
        ],
        require: ['https://code.jquery.com/jquery-3.4.1.slim.js'],
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.svg$/,
        use: 'url-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
