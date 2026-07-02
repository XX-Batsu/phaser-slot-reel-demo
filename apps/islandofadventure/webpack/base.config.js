const Config = require('webpack-config').Config
const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PathRewriterPlugin = require('webpack-path-rewriter')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HappyPack = require('happypack')
const git = require('git-rev-sync')

const isDevelopment = process.env.NODE_ENV === 'develop'
const isDevtest = process.env.NODE_ENV === 'devtest'
const isDevBase = process.env.DEV_BASE === 'true'
const happyThreadPool = HappyPack.ThreadPool({ size: 4 })
const nodeModules = (isDevBase) ? /node_modules\/(?!(slot-base\/src)\/).*/ : /node_modules/
const ver = (isDevelopment) ? 'dev' : git.short()
const commonFilePath = (isDevelopment)
  ? path.join('..', 'node_modules', 'GameExternal')
  : path.join('..', 'GameExternal')
const gameImagePath = (isDevelopment)
  ? path.join('..', 'src', 'assets/images')
  : path.join('.', 'assets/images')
const baseVer = require('../node_modules/slot-base/package.json').version
const commonVer = require('../node_modules/GameExternal/package.json').version

const opts = {
  baseUrl: path.join(__dirname, '..', 'src'),
  build: path.join(__dirname, '..', 'build'),
  bundle: isDevelopment ? '[name]-dev.js' : `[name].js?${ver}`,
  css: isDevelopment ? '[name]-dev.css' : `[name].css?${ver}`,
  assets: isDevelopment ? '[path][name]-dev.[ext]' : `[path][name].[ext]?${ver}`,
  md: '[path][name].html'
}

module.exports = new Config().merge({
  context: opts.baseUrl,
  cache: true,
  entry: {
    app: [ 'babel-polyfill', 'js/index.js' ]
    // loadingggg: [ 'babel-polyfill', 'js/main/Loading.js' ]
  },
  output: {
    path: opts.build,
    publicPath: '',
    filename: opts.bundle
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=babel',
        exclude: nodeModules
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css?sourceMap&camelCase&localIdentName=[name]__[local]___[hash:base64:5]')
      },
      { test: /img\/.*\.(png|jpg|jpeg|gif|svg)(\?[a-z0-9-]+)?$/, loader: `file?name=${opts.assets}` },
      { test: /font\/.*\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9-]+)?$/, loader: `file?name=${opts.assets}` },
      { test: /\.jade$/, loader: 'jade' },
      { test: /\.md/, loader: 'happypack/loader?id=md' }
    ],
    noParse: /\.min\.js/
  },
  resolve: {
    root: [ opts.baseUrl ],
    fallback: path.join(__dirname, '..', 'node_modules'),
    modulesDirectories: [ 'node_modules' ],
    extensions: [ '', '.js' ]
  },
  resolveLoader: { fallback: path.join(__dirname, '..', 'node_modules') },
  plugins: [
    new CleanWebpackPlugin([ 'build/*', '.happypack/*' ], { root: path.join(__dirname, '..') }),
    new CaseSensitivePathsPlugin(),
    new CopyWebpackPlugin([ { from: path.join(__dirname, '..', 'static'), to: opts.build } ], { ignore: [ { glob: '.*' } ] }),
    new ExtractTextPlugin(opts.css, { allChunks: true }),
    new PathRewriterPlugin({ emitStats: false }),
    new webpack.DllReferencePlugin({
      context: path.join(opts.baseUrl, 'dlls'),
      manifest: require('../src/dlls/dll.manifest.json')
    }),
    new AddAssetHtmlPlugin({
      filepath: require.resolve('../src/dlls/dll.js'),
      includeSourcemap: false,
      hash: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './template/index.jade',
      rev: (new Date()).toISOString(),
      tag: (isDevelopment) ? git.short() : (git.isTagDirty()) ? 'dev' : git.tag(),
      baseVer,
      commonVer,
      commonFilePath,
      gameImagePath
    }),
    new HappyPack({
      id: 'babel',
      loaders: [ 'babel?cacheDirectory=true' ],
      threadPool: happyThreadPool,
      verbose: false
    }),
    new HappyPack({
      id: 'md',
      loaders: [ `file?name=${opts.md}!html-minify` ],
      threadPool: happyThreadPool,
      verbose: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        commonFile: JSON.stringify(commonFilePath)
      }
    })
  ]
})
