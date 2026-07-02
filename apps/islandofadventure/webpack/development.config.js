const webpack = require('webpack')
const Config = require('webpack-config').Config
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = new Config().extend('./webpack/base.config.js').merge({
  entry: {
    app: [ require.resolve('webpack-dev-server/client') + '?/', require.resolve('webpack/hot/dev-server') ]
  },
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        IP: JSON.stringify(process.env.IP),
        AGENT_ID: JSON.stringify(process.env.AGENT_ID),
        HOME_URL: JSON.stringify(process.env.HOME_URL)
      },
      __DEV__: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        port: 4000,
        startPath: '?token=guest&language=zh-tw',
        proxy: {
          target: 'http://localhost:3100/',
          ws: true
        },
        logPrefix: 'Phaser',
        plugins: [
          {
            module: 'bs-html-injector',
            options: {
              files: [ 'src/**/*.jade' ]
            }
          }
        ]
      }
    )
  ]
})
