/* @flow */
import type { IModels } from './graphql/interfaces';

type GenerateFakeDataInput = {
  models: IModels,
};

export default async function generateFakeData({
  models: { User, Project, TaskGroup, Task, TimeUnit },
}: GenerateFakeDataInput) {
  const user = await User.create({
    email: 'test',
    password: 'test',
    nickname: 'test',
  });
  const projects = await Promise.all([
    Project.create({ ownerId: user.id, name: 'Work' }),
    Project.create({ ownerId: user.id, name: 'Private' }),
  ]);
  const taskGroups = await Promise.all([
    TaskGroup.create({ projectId: projects[0].id, name: 'TaskGroup A' }),
    TaskGroup.create({ projectId: projects[1].id, name: 'TaskGroup B' }),
  ]);
  await Promise.all([
    Task.create({ taskGroupId: taskGroups[0].id, name: 'Task A' }),
    Task.create({ taskGroupId: taskGroups[1].id, name: 'Task B' }),
  ]);
  await Promise.all([TimeUnit.create({})]);
}
