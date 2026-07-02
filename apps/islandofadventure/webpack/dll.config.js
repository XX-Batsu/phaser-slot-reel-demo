const path = require('path')
const webpack = require('webpack')
const Config = require('webpack-config').Config

const vendors = [
  'ansi-regex',
  'babel-polyfill',
  'babel-runtime/core-js',
  'bluebird',
  'core-js',
  'debug',
  'form-data',
  'is-promise',
  'json-stringify-safe',
  'lodash',
  'lodash/cloneDeep',
  'lodash/filter',
  'lodash/get',
  'lodash/set',
  'lodash/sumBy',
  'lodash/isEqual',
  'lodash/merge',
  'lodash/debounce',
  'lodash/intersection',
  'lodash/sortBy',
  'lodash/find',
  'lodash/omit',
  'ms',
  'object-assign',
  'query-string',
  'querystring',
  'strip-ansi',
  'i18next',
  'i18next-xhr-backend'
]

if (process.env.DEV_BASE !== 'true') {
  vendors.push('slot-base')
}

module.exports = new Config().merge({
  devtool: 'eval-cheap-module-source-map',
  output: {
    path: './src/dlls',
    filename: '[name].js',
    library: '[name]'
  },
  entry: {
    dll: vendors
  },
  plugins: [
    new webpack.DllPlugin({
      path: './src/dlls/[name].manifest.json',
      name: '[name]',
      context: path.join(__dirname, '..', 'src', 'dlls')
    })
  ]
})
