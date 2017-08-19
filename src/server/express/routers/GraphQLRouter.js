/* @flow */
import { Router as createRouter } from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import type { IModels, IServices, ISchema } from '../../graphql/interfaces';
import createAuthMiddleware from '../middlewares/AuthMiddleware';

type Input = {
  models: IModels,
  schema: ISchema,
  services: IServices,
};

export default async function createGraphQLRouter({
  models,
  models: { User },
  schema,
  services: { AuthService },
}: Input) {
  const authMiddleware = createAuthMiddleware({ User, AuthService });

  const router = createRouter();

  router.use(
    '/graphql',
    bodyParser.json(),
    authMiddleware,
    graphqlExpress(request => ({ schema, context: request })),
  );
  router.use(
    '/graphiql',
    authMiddleware,
    graphiqlExpress({ endpointURL: '/graphql' }),
  );

  return router;
}
