const path = require('path');
const AutoDllPlugin = require('autodll-webpack-plugin');
const BabiliWebpackPlugin = require('babili-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const sharedPlugins = [
  isProduction && new BabiliWebpackPlugin(),
  new webpack.EnvironmentPlugin({
    NODE_ENV: isProduction ? 'production' : 'development',
    PUBLIC_URL: '',
  }),
].filter(Boolean);

module.exports = () => {
  const appPort = process.env.APP_PORT || 3000;
  const graphQLPort = process.env.GRAPHQL_PORT || 3001;
  const webpackPort = process.env.WEBPACK_PORT || 3002;

  return {
    devtool: isProduction ? undefined : 'source-map',
    entry: {
      app: [
        'react-hot-loader/patch',
        'whatwg-fetch',
        !isProduction &&
          `webpack-dev-server/client?http://localhost:${webpackPort}`,
        'normalize.css',
        'font-awesome/css/font-awesome.min.css',
        './node_modules/react-select/dist/react-select.css',
        './src/client/app/assets/app.css',
        './src/client/app/index.tsx',
      ].filter(Boolean),
    },
    output: {
      path: path.join(__dirname, 'dist', 'public'),
      filename: '[name].js',
      publicPath: '/',
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist', 'public'),
      port: webpackPort,
      publicPath: '/',
      stats: { colors: true },
      proxy: {
        '**': `http://localhost:${appPort}`,
        changeOrigin: true,
      },
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
        template: './src/public/index.ejs',
        title: 'Dali',
      }),
      new HtmlWebpackHarddiskPlugin(),
      !isProduction && new webpack.HotModuleReplacementPlugin(),
      !isProduction && new webpack.NoEmitOnErrorsPlugin(),
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
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
      }),
      new SWPrecacheWebpackPlugin({
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: 'service-worker.js',
        logger(message) {
          if (message.indexOf('Total precache size is') === 0) {
            // This message occurs for every build and is a bit too noisy.
            return;
          }
          if (message.indexOf('Skipping static resource') === 0) {
            // This message obscures real errors so we ignore it.
            // https://github.com/facebookincubator/create-react-app/issues/2612
            return;
          }
          console.log(message);
        },
        minify: true,
        navigateFallback: '/index.html',
        // Don't precache sourcemaps (they're large) and build asset manifest:
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      }),
      new CopyWebpackPlugin([{ from: 'src/public' }]),
    ]
      .concat(sharedPlugins)
      .filter(Boolean),
    resolve: {
      extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
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
          test: /\.graphql$/,
          loader: 'graphql-tag/loader',
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.tsx?$/,
          loaders: ['react-hot-loader/webpack', 'awesome-typescript-loader'],
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          include: [
            path.resolve(__dirname, 'data'),
            path.resolve(__dirname, 'src'),
          ],
        },
      ],
    },
    stats: {
      children: false,
    },
  };
};
