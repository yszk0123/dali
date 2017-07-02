import path from 'path';
import graphQLHTTP from 'express-graphql';
import express from 'express';
import favicon from 'serve-favicon';
import createAuthMiddleware from './createAuthMiddleware';
import serverConfig from '../serverConfig';

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
    favicon(path.join(__dirname, '..', '..', 'public', 'favicon.ico')),
  );
  graphQLServer.use('/', authMiddleware, graphQLHTTPMiddleware);
  graphQLServer.listen(graphQLPort, () => {
    console.log(
      `GraphQL Server is now running on http://localhost:${graphQLPort}`,
    );
  });
}
