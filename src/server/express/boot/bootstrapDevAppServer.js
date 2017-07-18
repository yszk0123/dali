import path from 'path';
import favicon from 'serve-favicon';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import createWebpackConfig from '../../../../webpack.config';
import serverConfig from '../../shared/config/serverConfig';

export default async function bootstrapDevAppServer() {
  const { appPort, graphQLPort } = serverConfig;
  const webpackConfig = createWebpackConfig({
    appPort,
    autoReload: true,
    graphQLPort,
  });
  const compiler = webpack(webpackConfig);
  const app = new WebpackDevServer(compiler, webpackConfig.devServer);

  app.use(
    favicon(path.join(__dirname, '..', '..', '..', 'public', 'favicon.ico')),
  );
  app.listen(appPort, () => {
    console.log(`App is now running on http://localhost:${appPort}`);
  });
}
