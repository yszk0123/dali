import Sequelize from 'sequelize';

const modelNames = [
  'DailyReport',
  'DailySchedule',
  'Project',
  'TaskUnit',
  'TimeUnit',
  'User',
];

export default async function connectDatabase() {
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
  });

  const models = {};
  modelNames.forEach(name => {
    models[name] = sequelize.import(
      name,
      require(`${__dirname}/models/${name}`),
    );
  });

  modelNames.forEach(name => {
    const { associate } = models[name];
    if (associate) {
      associate(models);
    }
  });

  await sequelize.sync({ force: true });

  return { models };
}
