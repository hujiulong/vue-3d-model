var config = require('./webpack.release.js')
var webpack = require('webpack')
var utils = require('./utils')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

config.output.filename = config.output.filename.replace(/\.js$/, '.min.js')

delete config.devtool

config.plugins = [
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
    compress: {
      warnings: false
    }
  }),
  new ExtractTextPlugin({
	  filename: utils.assetsPath('css/[name].[contenthash].css')
	}),
]

module.exports = config
