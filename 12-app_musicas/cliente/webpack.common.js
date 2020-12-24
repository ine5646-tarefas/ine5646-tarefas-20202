/* eslint-disable no-undef */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const {GenerateSW} = require('workbox-webpack-plugin')

const config = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, '../servidor/publico'),
    filename: '[name].[contenthash].bundle.js'
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [ 
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(
      {
        title: 'UFSC - CTC - INE - INE5646 :: App Músicas',
        meta: {
          viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
        }
      }),
    new webpack.ids.HashedModuleIdsPlugin(),
    new GenerateSW({
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
      additionalManifestEntries: [{url: 'index.html', revision: null}],
      maximumFileSizeToCacheInBytes: 5000000,
      runtimeCaching: [
        {
          urlPattern: /https:\/\/assets.fanart.tv\/fanart\/music\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'imagens',
            cacheableResponse: {
              statuses: [0, 200]
            },
            expiration: {
              maxEntries: 10
            }
          }
        },
        {
          urlPattern: /topArtistas/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'topArtistas',
            expiration: {
              maxEntries: 10
            }
          }
        },
        
      ]
    })    
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, 
        use: 'babel-loader', 
        exclude: /node_modules/
      },
      {
        test: /\.css$/, 
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
}

module.exports = config
