import express from 'express';
import graphQLHTTP from 'express-graphql';
import { schema } from './data/schema';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import createWebpackConfig from './webpack.config';

const APP_PORT = process.env.APP_PORT || 3000;
const GRAPHQL_PORT = process.env.GRAPHQL_PORT || 3001;

function bootstrapGraphQLServer() {
  const graphQLConfig = {
    schema,
    graphiql: true,
  };
  const graphQLServer = express();
  graphQLServer.use('/', graphQLHTTP(graphQLConfig));
  graphQLServer.listen(GRAPHQL_PORT, () => {
    console.log(
      `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`,
    );
  });
}

function bootstrapAppServer() {
  const webpackConfig = createWebpackConfig({
    appPort: APP_PORT,
    graphQLPort: GRAPHQL_PORT,
  });
  const compiler = webpack(webpackConfig);
  const app = new WebpackDevServer(compiler, webpackConfig.devServer);
  app.listen(APP_PORT, () => {
    console.log(`App is now running on http://localhost:${APP_PORT}`);
  });
}

bootstrapGraphQLServer();
bootstrapAppServer();
