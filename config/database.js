module.exports = {
  development: {
    url: process.env.DATABASE_URL,
  },
  test: {
    username: 'test',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
  },
};
