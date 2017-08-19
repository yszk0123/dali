/* @flow */
import path from 'path';
import Sequelize from 'sequelize';
import serverConfig from '../../shared/config/serverConfig';
import type { IModels } from '../../graphql/interfaces';

const modelNames = [
  'Member',
  'Project',
  'Task',
  'TaskGroup',
  'TimeUnit',
  'User',
];

type Output = {
  models: IModels,
  sequelize: any,
};

export default async function connectDatabase(): Promise<Output> {
  const sequelize = new Sequelize(serverConfig.databaseUrl, {
    dialect: 'postgres',
  });
  const models = ({}: any);

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

  await sequelize.sync();

  return { models: (models: IModels), sequelize };
}
