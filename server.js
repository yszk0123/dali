import express from 'express';
import graphQLHTTP from 'express-graphql';
import defineSchema from './data/boot/defineSchema';
import connectDatabase from './data/boot/connectDatabase';
import generateFakeData from './data/generateFakeData';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import createWebpackConfig from './webpack.config';

const APP_PORT = process.env.APP_PORT || 3000;
const GRAPHQL_PORT = process.env.GRAPHQL_PORT || 3001;

async function bootstrapGraphQLServer() {
  const { models, sequelize } = await connectDatabase();
  await generateFakeData({ models });
  const graphQLConfig = {
    schema: defineSchema({ models, sequelize }),
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

async function main() {
  try {
    await bootstrapGraphQLServer();
    await bootstrapAppServer();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
