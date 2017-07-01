import Sequelize from 'sequelize';
import path from 'path';
import serverConfig from '../serverConfig';

const modelNames = [
  'DailyReport',
  'DailySchedule',
  'Project',
  'TaskUnit',
  'TimeUnit',
  'User',
];

export default async function connectDatabase({ noSync } = {}) {
  const sequelize = new Sequelize(serverConfig.databaseUrl, {
    dialect: 'postgres',
  });
  const models = {};

  modelNames.forEach(name => {
    models[name] = sequelize.import(
      name,
      require(path.join(__dirname, '..', 'models', name)),
    );
  });

  modelNames.forEach(name => {
    const { associate } = models[name];
    if (associate) {
      associate(models);
    }
  });

  if (!noSync) {
    await sequelize.sync({ force: true });
  }

  return { models, sequelize };
}
