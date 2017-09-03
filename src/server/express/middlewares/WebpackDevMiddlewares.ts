import { IExpressMiddleware } from '../interfaces';
const webpack = require('webpack');
const webpackConfig = require('../../../../webpack.config')(); // eslint-disable-line
const compiler = webpack(webpackConfig);

export default function createWebpackDevMiddlewares(): IExpressMiddleware[] {
  return [
    require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
    }),
    require('webpack-hot-middleware')(compiler, {
      log: console.log,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
    }),
  ];
}
