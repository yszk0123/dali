import path from 'path';
import express from 'express';
import favicon from 'serve-favicon';
import graphQLHTTP from 'express-graphql';
import serverConfig from '../../shared/config/serverConfig';
import createAuthMiddleware from './createAuthMiddleware';

export default async function bootstrapGraphQLServer({
  services: { AuthService },
  models: { User },
  schema,
}) {
  const { graphQLPort } = serverConfig;
  const authMiddleware = createAuthMiddleware({ User, AuthService });
  const graphQLHTTPMiddleware = graphQLHTTP({
    schema,
    graphiql: true,
  });
  const graphQLServer = express();

  graphQLServer.use(
    favicon(
      path.join(__dirname, '..', '..', '..', '..', 'public', 'favicon.ico'),
    ),
  );
  graphQLServer.use('/', authMiddleware, graphQLHTTPMiddleware);
  graphQLServer.listen(graphQLPort, () => {
    console.log(
      `GraphQL Server is now running on http://localhost:${graphQLPort}`,
    );
  });
}
