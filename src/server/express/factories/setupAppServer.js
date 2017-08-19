import path from 'path';
import express from 'express';
import fallback from 'express-history-api-fallback';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import serverConfig from '../../shared/config/serverConfig';
import createGraphQLRouter from '../routers/GraphQLRouter';
import type { IModels, IServices, ISchema } from '../../graphql/interfaces';

type Input = {
  models: IModels,
  schema: ISchema,
  services: IServices,
};

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
  app.use(favicon(path.join(publicDir, 'favicon.ico')));
  app.use(graphqlRouter);
  app.use(express.static(publicDir));

  app.use(fallback('index.html', { root: publicDir }));

  app.listen(appPort, () => {
    console.log(`App is now running on http://localhost:${appPort}`);
  });
}
