import path from 'path';
import Sequelize from 'sequelize';
import serverConfig from '../../shared/config/serverConfig';

const modelNames = [
  'DailyReport',
  'DailySchedule',
  'Project',
  'TaskSet',
  'TaskUnit',
  'TimeUnit',
  'User',
];

export default async function connectDatabase() {
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

  return { models, sequelize };
}
