import dotenv from 'dotenv';
dotenv.config();

const appPort = process.env.APP_PORT || 3000;
const graphQLPort = process.env.GRAPHQL_PORT || 3001;
const secret = process.env.SECRET;
const databaseUrl = process.env.DATABASE_URL;

export default {
  appPort,
  databaseUrl,
  graphQLPort,
  secret,
};
