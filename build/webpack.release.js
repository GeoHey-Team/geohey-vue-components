var vue = require('vue-loader')
var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require("webpack")
var merge = require('webpack-merge')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var projectRoot = path.resolve(__dirname, '../')
var baseWebpackConfig = require('./webpack.base.conf')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}


module.exports = {
  entry: {
    'geohey-vue-components': './src/index.js'
  },
  externals: {
    vue: {
        root: 'Vue',
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue'
    }
  },
  output: {
    path: config.release.assetsRoot,
    filename: '[name].js',
    library: 'GeoHeyVueComponents',
    libraryTarget: 'umd'
  },
  resolve: baseWebpackConfig.resolve,
  module: baseWebpackConfig.module
}

if (process.env.NODE_ENV === 'production') {

  delete module.exports.devtool
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin({
      filename: 'geohey-vue-components.css'
    }),
  ]
}
