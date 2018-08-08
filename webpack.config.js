const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  
  entry: './src/index.js',
  
  output: {
    filename: 'keynote.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [{
      
      test: /.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        // .babelrc
        options: {
          presets: ['@babel/preset-env']
        }
      }

    }, {

      test: /.scss$/,
      exclude: /(node_modules)/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader'
      }, {
        loader: 'postcss-loader',
        // postcss.config.js
        options: {
          ident: 'postcss',
          plugins: (loader) => [
            require('postcss-import')({ root: loader.resourcePath }),
            require('autoprefixer')()
          ]
        }
      }, {
        loader: 'sass-loader'
      }]

    }]
  },

  plugins: plugins(),

  devServer: {
    port: 1234,
    open: true,
    hot: true
  },

  // 'development' / 'production'
  mode: process.env.NODE_ENV

}

function plugins() {

  console.log('Current Running Environment:', process.env.NODE_ENV, '\n')
  
  if (process.env.NODE_ENV === 'production') {
    return []
  }

  // 'development'
  return [
    new HtmlWebpackPlugin({
      template: './example/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
