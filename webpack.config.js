'use strict';

// Modules
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
  
  var config = {};

  config.entry = {
    app: './src/import-all.js'
  };
  
  config.output = {
    // Absolute output directory
    path: __dirname + '/dist',

    // Output path from the view of the page
    publicPath: '/slot-mixer-platform/',

    // Filename for entry points
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

    // Filename for non-entry points
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
  };

  /**
   * Type of sourcemap to use per build type
   */
  if (isProd) {
    config.devtool = 'source-map';
  }
  else {
    config.devtool = 'eval-source-map';
  }

  /**
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    rules: [{
      // JS LOADER
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.(less)$/,
      use: [{
        loader: 'style-loader' // creates style nodes from JS strings
      }, {
        loader: 'css-loader' // translates CSS into CommonJS
      }, {
        loader: 'less-loader' // compiles Less to CSS
      }]
    }, {
      // ASSET LOADER
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      loader: 'file-loader'
    }, {
      // HTML LOADER
      test: /\.html$/,
      loader: 'raw-loader'
    }]
  };
  /**
   * Plugins
   */
  config.plugins = [
    new CleanWebpackPlugin(),
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/i,
      options: {
        postcss: {
          plugins: [autoprefixer]
        }
      }
    })
  ];

  // Render index.html
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body'
    }),
    // Extract css files
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin({filename: 'css/[name].css', disable: !isProd, allChunks: true}),

    // Copy assets from the theme folder
    new CopyWebpackPlugin([{
      from: __dirname + '/src/theme', to: 'theme'
    }])
  )
  

  // Add build specific plugins
  if (isProd) {
    config.plugins.push(
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(),

      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin(),

      // Copy assets from the public folder
      new CopyWebpackPlugin([{
        from: __dirname + '/public'
      }])
    )
  }

  /**
   * Dev server configuration
   */
  config.devServer = {
    contentBase: './public',
    stats: 'minimal',
    host: 'localhost'
  };

  return config;
}();
