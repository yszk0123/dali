/* @flow */
import { resolver } from 'graphql-sequelize';
import { camelCase, omitBy, isUndefined } from 'lodash';
import type { IResolvers, IModels } from '../interfaces';

type Input = {
  models: IModels,
};

export default function createResolvers({
  models: { Task, TaskGroup },
}: Input): IResolvers {
  return {
    Task: {
      owner: resolver(Task.Owner),
      taskGroup: resolver(Task.TaskGroup),
      timeUnit: resolver(Task.TimeUnit),
      assignee: resolver(Task.Assignee),
    },
    Query: {
      tasks: resolver(Task, {
        list: true,
        before: (findOptions, { orderBy }, context) => {
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
        { title, description, done, taskGroupId, timeUnitId, assigneeId },
        { user },
      ) => {
        return await Task.create({
          title,
          description,
          done,
          taskGroupId,
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
          taskGroupId,
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
            { title, description, done, taskGroupId, timeUnitId, assigneeId },
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
      addTaskToTaskGroup: async (root, { taskId, taskGroupId }, { user }) => {
        const task = await Task.findOne({
          where: { id: taskId, ownerId: user.id },
          rejectOnEmpty: true,
        });
        const taskGroup = await TaskGroup.findOne({
          where: { id: taskGroupId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await taskGroup.addTask(task);
        await task.reload();

        return { task, taskGroup };
      },
    },
  };
}
