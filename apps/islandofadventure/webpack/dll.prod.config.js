const webpack = require('webpack')
const Config = require('webpack-config').Config
const path = require('path')

module.exports = new Config().extend('./webpack/dll.config.js').merge({
  devtool: null,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        commonFile: JSON.stringify(path.join('..', 'GameExternal')),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        IP: JSON.stringify(process.env.IP),
        AGENT_ID: JSON.stringify(process.env.AGENT_ID),
        HOME_URL: JSON.stringify(process.env.HOME_URL)
      }
    }),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, comments: false })
  ]
})
