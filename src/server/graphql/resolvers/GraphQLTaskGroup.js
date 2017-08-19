/* @flow */
import { resolver } from 'graphql-sequelize';
import { camelCase, omitBy, isUndefined } from 'lodash';
import type { IResolvers, IModels } from '../interfaces';

type Input = {
  models: IModels,
};

export default function createResolvers({
  models: { TaskGroup, Task, Project },
}: Input): IResolvers {
  return {
    TaskGroup: {
      owner: resolver(TaskGroup.Owner),
      project: resolver(TaskGroup.Project),
      tasks: resolver(TaskGroup.Tasks),
    },
    Query: {
      taskGroups: resolver(TaskGroup, {
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
      createTaskGroup: async (
        root,
        { title, description, done, projectId },
        { user },
      ) => {
        return await TaskGroup.create({
          ownerId: user.id,
          title,
          description,
          done,
          projectId,
        });
      },
      updateTaskGroup: async (
        root,
        { taskGroupId, title, description, done, projectId },
        { user },
      ) => {
        const taskGroup = await TaskGroup.findOne({
          where: { id: taskGroupId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await taskGroup.update(
          omitBy({ title, description, done, projectId }, isUndefined),
        );

        return taskGroup;
      },
      removeTaskGroup: async (root, { taskGroupId }, { user }) => {
        const taskGroup = await TaskGroup.findOne({
          where: { id: taskGroupId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await taskGroup.destroy();

        return { removedTaskGroupId: taskGroupId };
      },
      moveTaskToTaskGroup: async (root, { taskId, taskGroupId }, { user }) => {
        const task = await Task.findById(taskId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });
        const sourceTaskGroup = await task.getTaskGroup();
        const targetTaskGroup = await TaskGroup.findById(taskGroupId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });

        await task.setTaskGroup(targetTaskGroup);

        return { task, sourceTaskGroup, targetTaskGroup };
      },
      addTaskGroupToProject: async (
        root,
        { taskGroupId, projectId },
        { user },
      ) => {
        const taskGroup = await TaskGroup.findById(taskGroupId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });
        const project = await Project.findById(projectId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });

        await taskGroup.setProject(project);

        return { taskGroup, project };
      },
    },
  };
}
