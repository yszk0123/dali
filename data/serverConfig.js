const appPort = process.env.APP_PORT || 3000;
const graphQLPort = process.env.GRAPHQL_PORT || 3001;

export default {
  appPort,
  graphQLPort,
  secret: 'SECRET', // TODO: Use environment variable
};
