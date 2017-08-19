import * as dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

export default {
  ...require(`./serverConfig.${env}`).default,
  databaseUrl: require('./database')[env].url,
};
