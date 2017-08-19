/* @flow */
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import serverConfig from '../../shared/config/serverConfig';
import type { IModels, IServices, ISchema } from '../../graphql/interfaces';
import createAuthMiddleware from './createAuthMiddleware';
const { graphQLPort } = serverConfig;

type Input = {
  models: IModels,
  schema: ISchema,
  services: IServices,
};

export default async function setupGraphQLServer({
  models,
  models: { User },
  schema,
  services: { AuthService },
}: Input) {
  const authMiddleware = createAuthMiddleware({ User, AuthService });

  const server = express();

  server.use(
    favicon(path.join(__dirname, '..', '..', '..', 'public', 'favicon.ico')),
  );
  server.use(
    '/graphql',
    bodyParser.json(),
    authMiddleware,
    graphqlExpress(request => ({ schema, context: request })),
  );
  server.use(
    '/graphiql',
    authMiddleware,
    graphiqlExpress({ endpointURL: '/graphql' }),
  );
  server.listen(graphQLPort, () => {
    console.log(
      `GraphQL Server is now running on http://localhost:${graphQLPort}`,
    );
  });
}

// throw new Error(
//   'TODO: export express.Routes instead of server and rename to createGraphQLRoute.js',
// );
