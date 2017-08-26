import { Sequelize } from 'sequelize';
import { IModels } from './graphql/interfaces';

interface GenerateFakeDataInput {
  sequelize: Sequelize;
  models: IModels;
}

export default async function generateFakeData({
  sequelize,
  models: { User, Project, Phase, Task, TimeUnit },
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
    const phases = await Promise.all([
      Phase.create(
        {
          ownerId: user.id,
          projectId: projects[0].id,
          title: 'Phase A',
        },
        { transaction },
      ),
      Phase.create(
        {
          ownerId: user.id,
          projectId: projects[1].id,
          title: 'Phase B',
        },
        { transaction },
      ),
    ]);
    await Promise.all([
      Task.create(
        {
          ownerId: user.id,
          phaseId: phases[0].id,
          title: 'Task A',
        },
        { transaction },
      ),
      Task.create(
        {
          ownerId: user.id,
          phaseId: phases[1].id,
          title: 'Task B',
        },
        { transaction },
      ),
    ]);
    await Promise.all([
      TimeUnit.create(
        {
          ownerId: user.id,
          date: '2017-01-20',
          position: 10,
        },
        { transaction },
      ),
      TimeUnit.create(
        {
          ownerId: user.id,
          date: '2017-01-20',
          position: 11,
        },
        { transaction },
      ),
      TimeUnit.create(
        {
          ownerId: user.id,
          date: '2017-01-20',
          position: 13,
        },
        { transaction },
      ),
      TimeUnit.create(
        {
          ownerId: user.id,
          date: '2017-01-21',
          position: 10,
        },
        { transaction },
      ),
    ]);
  });
}
