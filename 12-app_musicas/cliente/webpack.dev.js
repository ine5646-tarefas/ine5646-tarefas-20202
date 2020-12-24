/* eslint-disable no-undef */
const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')

const opcoes = {
  mode: 'development',
  devtool: 'inline-source-map'
}

module.exports = merge(common, opcoes)
