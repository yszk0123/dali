import * as path from 'path';
import * as express from 'express';
import * as fallback from 'express-history-api-fallback';
import * as favicon from 'serve-favicon';
import * as morgan from 'morgan';
import serverConfig from '../../shared/config/serverConfig';
import createGraphQLRouter from '../routers/GraphQLRouter';
import { IModels, IServices, ISchema } from '../../graphql/interfaces';

interface Input {
  models: IModels;
  schema: ISchema;
  services: IServices;
}

export default async function setupAppServer({
  models,
  schema,
  services,
}: Input) {
  const { appPort } = serverConfig;
  const app = express();
  const graphqlRouter = await createGraphQLRouter({ models, schema, services });
  const rootDir = path.join(__dirname, '..', '..', '..', '..');
  const publicDir = path.join(rootDir, 'dist', 'public');

  app.use(morgan('combined'));
  app.use(favicon(
    path.join(publicDir, 'favicon.ico'),
  ) as express.RequestHandler);

  // TODO: Don't use process.env.NODE_ENV in production code
  if (process.env.NODE_ENV !== 'production') {
    const createDevMiddlewares = require('../middlewares/WebpackDevMiddlewares');
    app.use(...(createDevMiddlewares.default || createDevMiddlewares)());
  }
  app.use(graphqlRouter);
  app.use(express.static(publicDir));

  app.use(fallback('index.html', { root: publicDir }));

  app.listen(appPort, () => {
    console.log(`App is now running on http://localhost:${appPort}`);
  });
}
