import { resolver } from 'graphql-sequelize';
import { camelCase, omitBy, isUndefined } from 'lodash';
import { IResolvers, IModels, IContext } from '../interfaces';

interface Input {
  models: IModels;
}

export default function createResolvers({
  models: { Task, Phase },
}: Input): IResolvers {
  return {
    Task: {
      owner: resolver(Task.Owner),
      phase: resolver(Task.Phase),
      timeUnit: resolver(Task.TimeUnit),
      assignee: resolver(Task.Assignee),
    },
    Query: {
      tasks: resolver(Task, {
        list: true,
        before: (findOptions: any, { orderBy }: any, context: IContext) => {
          if (orderBy) {
            findOptions.order = [[camelCase(orderBy.field), orderBy.direction]];
          }

          return findOptions;
        },
      }),
    },
    Mutation: {
      createTask: async (
        root,
        { title, description, done, phaseId, timeUnitId, assigneeId },
        { user },
      ) => {
        return await Task.create({
          title,
          description,
          done,
          phaseId,
          timeUnitId,
          assigneeId,
          ownerId: user.id,
        });
      },
      updateTask: async (
        root,
        {
          taskId,
          title,
          description,
          done,
          phaseId,
          timeUnitId,
          assigneeId,
        },
        { user },
      ) => {
        const task = await Task.findOne({
          where: { id: taskId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await task.update(
          omitBy(
            { title, description, done, phaseId, timeUnitId, assigneeId },
            isUndefined,
          ),
        );

        return task;
      },
      removeTask: async (root, { taskId }, { user }) => {
        const task = await Task.findOne({
          where: { id: taskId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await task.destroy();

        return { removedTaskId: taskId };
      },
      addTaskToPhase: async (root, { taskId, phaseId }, { user }) => {
        const task = await Task.findOne({
          where: { id: taskId, ownerId: user.id },
          rejectOnEmpty: true,
        });
        const phase = await Phase.findOne({
          where: { id: phaseId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await phase.addTask(task);
        await task.reload();

        return { task, phase };
      },
    },
  };
}
