import * as path from 'path';
import * as Sequelize from 'sequelize';
import serverConfig from '../../shared/config/serverConfig';
import { IModels } from '../../graphql/interfaces';

const modelNames = ['Member', 'Project', 'Task', 'Phase', 'TimeUnit', 'User'];

type Output = {
  models: IModels;
  sequelize: any;
};

export default async function connectDatabase(): Promise<Output> {
  const sequelize = new Sequelize(serverConfig.databaseUrl, {
    dialect: 'postgres',
  } as any);
  const models: any = {};

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

  return { models: models as IModels, sequelize };
}
