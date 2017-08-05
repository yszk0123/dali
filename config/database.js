module.exports = {
  development: {
    url: 'postgres://dali:365@dali-database:5432/dali',
  },
  test: {
    url: 'postgres://dali:365@dali-database:5432/dali_test',
  },
  production: {
    url: process.env.DATABASE_URL,
  },
};
