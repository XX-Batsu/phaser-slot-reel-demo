const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const AppcacheWebpackPlugin = require('appcache-webpack-plugin')
const Config = require('webpack-config').Config

const copyFrom = path.join(__dirname, '..', 'src', 'assets')
const copyTo = path.join(__dirname, '..', 'build', 'assets')

module.exports = new Config().extend('./webpack/base.config.js').merge({
  devtool: null,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        IP: JSON.stringify(process.env.IP),
        AGENT_ID: JSON.stringify(process.env.AGENT_ID),
        HOME_URL: JSON.stringify(process.env.HOME_URL)
      },
      __DEV__: false
    }),
    new CopyWebpackPlugin([ { from: copyFrom, to: copyTo } ], { ignore: [ { glob: '.*' } ] }),
    new AppcacheWebpackPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, comments: false })
  ]
})
