'use strict';

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin'),
      processenv = require('processenv'),
      webpack = require('webpack');

const getEnvironmentVariables = function (environment) {
  return {
    'process.env.NODE_ENV': JSON.stringify(environment)
  };
};

const getDevTool = function (environment) {
  switch (environment) {
    case 'production':
      return undefined;
    default:
      return 'cheap-module-source-map';
  }
};

const getEntries = function (environment) {
  switch (environment) {
    case 'production':
      return [
        './index.js'
      ];
    default:
      return [
        './index.js'
      ];
  }
};

const getPlugins = function ({ environment, paths }) {
  if (!paths) {
    throw new Error('Paths are missing.');
  }

  switch (environment) {
    case 'production':
      return [
        new webpack.DefinePlugin(getEnvironmentVariables(environment)),
        new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({
          template: path.join(paths.src, 'template.ejs'),
          minify: {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true
          }
        })
      ];
    default:
      return [
        new webpack.DefinePlugin(getEnvironmentVariables()),

        // enable HMR globally
        new webpack.HotModuleReplacementPlugin(),

        // prints more readable module names in the browser console on HMR updates
        new webpack.NamedModulesPlugin(),

        // do not emit compiled assets that include errors
        new webpack.NoEmitOnErrorsPlugin(),

        new HtmlWebpackPlugin({
          template: path.join(paths.src, 'template.ejs')
        })
      ];
  }
};

const getDefaultConfiguration = function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const paths = {
    src: path.join(directory, 'src'),
    build: path.join(directory, 'build')
  };

  const environment = processenv('NODE_ENV');

  const configuration = {
    devtool: getDevTool(environment),
    context: paths.src,
    target: 'web',
    devServer: {
      contentBase: paths.src,
      compress: true,
      host: 'localhost',
      port: 8080,
      hot: true
    },
    entry: getEntries(environment),
    output: {
      path: paths.build,
      filename: 'index.js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [
            paths.src
          ],
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(svg|jpe?g|png|gif|ico)$/i,
          use: [
            { loader: 'file-loader' }
          ]
        }
      ]
    },
    plugins: getPlugins({ environment, paths })
  };

  return configuration;
};

module.exports = getDefaultConfiguration;
