export default {
  appPort: process.env.APP_PORT || 3000,
  graphQLPort: process.env.GRAPHQL_PORT || 3001,
  webpackPort: process.env.WEBPACK_PORT || 3002,
  secret: process.env.SECRET,
};
