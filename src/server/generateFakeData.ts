import { Sequelize } from 'sequelize';
import { IModels } from './graphql/interfaces';

interface GenerateFakeDataInput {
  sequelize: Sequelize;
  models: IModels;
}

export default async function generateFakeData({
  sequelize,
  models: { User, Project, Task, Action, Period },
}: GenerateFakeDataInput): Promise<any> {
  return await sequelize.transaction(async transaction => {
    const user = await User.create(
      {
        email: 'test@gmail.com',
        password: 'test',
        nickname: 'test',
      },
      { transaction },
    );
    const projects = await Promise.all([
      Project.create({ ownerId: user.id, title: 'Work' }, { transaction }),
      Project.create({ ownerId: user.id, title: 'Private' }, { transaction }),
    ]);
    const tasks = await Promise.all([
      Task.create(
        {
          ownerId: user.id,
          projectId: projects[0].id,
          title: 'Task A',
        },
        { transaction },
      ),
      Task.create(
        {
          ownerId: user.id,
          projectId: projects[1].id,
          title: 'Task B',
        },
        { transaction },
      ),
    ]);
    const actions = await Promise.all([
      Action.create(
        {
          ownerId: user.id,
          taskId: tasks[0].id,
          title: 'Action A',
        },
        { transaction },
      ),
      Action.create(
        {
          ownerId: user.id,
          taskId: tasks[1].id,
          title: 'Action B',
        },
        { transaction },
      ),
    ]);
    const periods = await Promise.all([
      Period.create(
        {
          ownerId: user.id,
          date: '2017-01-20',
          position: 10,
        },
        { transaction },
      ),
      Period.create(
        {
          ownerId: user.id,
          date: '2017-01-20',
          position: 11,
        },
        { transaction },
      ),
      Period.create(
        {
          ownerId: user.id,
          date: '2017-01-20',
          position: 13,
        },
        { transaction },
      ),
      Period.create(
        {
          ownerId: user.id,
          date: '2017-01-21',
          position: 10,
        },
        { transaction },
      ),
    ]);

    return { user, projects, tasks, actions, periods };
  });
}
