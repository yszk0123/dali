import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

module.exports = {
  ...require(`./serverConfig.${env}`).default,
  databaseUrl: require('./database')[env].url,
};
