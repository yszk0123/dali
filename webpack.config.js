const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const BabiliWebpackPlugin = require('babili-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = (env = {}) => {
  const appPort = env.appPort || process.env.APP_PORT || 3000;
  const graphQLPort = env.graphQLPort || process.env.GRAPHQL_PORT || 3001;

  return {
    devtool: isProduction ? undefined : 'source-map',
    entry: {
      app: [
        'whatwg-fetch',
        'normalize.css',
        !isProduction && `webpack-dev-server/client?http://0.0.0.0:${appPort}`,
        './src/app.css',
        './src/app.js',
      ].filter(Boolean),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
      publicPath: '/',
    },
    resolve: {
      // alias: {
      //   react: 'preact-compat',
      //   'react-dom': 'preact-compat',
      // },
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
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
        title: 'Dali',
        alwaysWriteToDisk: true,
        filename: 'index.html',
        chunks: ['app'],
      }),
      new HtmlWebpackHarddiskPlugin(),
      // new CopyWebpackPlugin([
      //   { from: 'src/manifest.json' },
      //   { from: '*.png', to: 'images', context: 'src/images' },
      // ]),
      isProduction && new BabiliWebpackPlugin(),
    ].filter(Boolean),
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
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
  };
};
