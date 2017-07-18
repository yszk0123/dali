const path = require('path');
const webpack = require('webpack');
const AutoDllPlugin = require('autodll-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BabiliWebpackPlugin = require('babili-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const sharedPlugins = [
  isProduction && new BabiliWebpackPlugin(),
  new webpack.EnvironmentPlugin({
    NODE_ENV: isProduction ? 'production' : 'development',
  }),
].filter(Boolean);

module.exports = (env = {}) => {
  const appPort = env.appPort || process.env.APP_PORT || 3000;
  const graphQLPort = env.graphQLPort || process.env.GRAPHQL_PORT || 3001;

  return {
    devtool: isProduction ? undefined : 'source-map',
    entry: {
      app: [
        'whatwg-fetch',
        'normalize.css',
        'font-awesome/css/font-awesome.min.css',
        env.autoReload && `webpack-dev-server/client?http://0.0.0.0:${appPort}`,
        './src/client/app/assets/app.css',
        './src/client/app/index.js',
      ].filter(Boolean),
    },
    output: {
      path: path.join(__dirname, 'dist', 'public'),
      filename: '[name].js',
      publicPath: '/',
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist', 'public'),
      proxy: { '/graphql': `http://localhost:${graphQLPort}` },
      publicPath: '/',
      historyApiFallback: true,
      stats: { colors: true },
      overlay: {
        errors: true,
      },
    },
    plugins: [
      new ExtractTextPlugin('styles.css'),
      new HtmlWebpackPlugin({
        alwaysWriteToDisk: true,
        chunks: ['app'],
        filename: 'index.html',
        inject: true,
        title: 'Dali',
      }),
      new HtmlWebpackHarddiskPlugin(),
      new AutoDllPlugin({
        context: __dirname,
        filename: '[name].[hash].js',
        inject: true,
        path: './dll',
        entry: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'styled-components',
          ],
        },
        plugins: sharedPlugins,
      }),
      new CopyWebpackPlugin([{ from: 'src/public' }]),
    ]
      .concat(sharedPlugins)
      .filter(Boolean),
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader',
          }),
        },
        {
          test: /\.woff2?(\?\S*)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
            },
          },
        },
        {
          test: /\.(jpe?g|gif|png|svg|eot|otf|ttf|wav|mp3)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: '/assets/',
            },
          },
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
  };
};
