/* @flow */
import type { IModels } from './graphql/interfaces';

type GenerateFakeDataInput = {
  sequelize: any,
  models: IModels,
};

export default async function generateFakeData({
  sequelize,
  models: { User, Project, TaskGroup, Task, TimeUnit },
}: GenerateFakeDataInput) {
  await sequelize.transaction(async transaction => {
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
    const taskGroups = await Promise.all([
      TaskGroup.create(
        {
          ownerId: user.id,
          projectId: projects[0].id,
          title: 'TaskGroup A',
        },
        { transaction },
      ),
      TaskGroup.create(
        {
          ownerId: user.id,
          projectId: projects[1].id,
          title: 'TaskGroup B',
        },
        { transaction },
      ),
    ]);
    await Promise.all([
      Task.create(
        {
          ownerId: user.id,
          taskGroupId: taskGroups[0].id,
          title: 'Task A',
        },
        { transaction },
      ),
      Task.create(
        {
          ownerId: user.id,
          taskGroupId: taskGroups[1].id,
          title: 'Task B',
        },
        { transaction },
      ),
    ]);
    await Promise.all([
      TimeUnit.create(
        { ownerId: user.id, startAt: new Date(), endAt: new Date() },
        { transaction },
      ),
    ]);
  });
}
