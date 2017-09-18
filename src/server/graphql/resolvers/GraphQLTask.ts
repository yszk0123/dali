import { Sequelize } from 'sequelize';
import { camelCase, omitBy, isUndefined } from 'lodash';
import { ISource, IResolvers, IModels, IContext } from '../interfaces';
import { resolver } from '../utils';

interface Input {
  models: IModels;
}

export default function createResolvers({
  models: { Task, Action, Project },
}: Input): IResolvers {
  return {
    Task: {
      owner: resolver(Task.Owner),
      project: resolver(Task.Project),
      actions: resolver(Task.Actions, {
        before: (findOptions: any, { used }: any, context: IContext) => {
          const where = { ...findOptions.where };

          if (used != null) {
            Object.assign(where, { periodId: used ? { $not: null } : null });
          }

          findOptions.where = where;

          return findOptions;
        },
      }),
      assignee: resolver(Task.Assignee),
    },
    Query: {
      tasks: resolver(Task, {
        list: true,
        before: (findOptions: any, { groupId }: any, context: IContext) => {
          const where = { ...findOptions.where };

          if (groupId != null) {
            findOptions.include = [{ model: Project, where: { groupId } }];
          }

          findOptions.where = where;

          return findOptions;
        },
      }),
    },
    Mutation: {
      createTask: async (
        source,
        { title, description, done, projectId },
        { user },
      ) => {
        return await Task.create({
          ownerId: user.id,
          title,
          description,
          done,
          projectId,
        });
      },
      updateTask: async (
        source,
        { taskId, title, description, done, projectId },
        { user },
      ) => {
        const task = await Task.findOne({
          where: { id: taskId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await task.update(
          omitBy({ title, description, done, projectId }, isUndefined),
        );

        return task;
      },
      removeTask: async (source, { taskId }, { user }) => {
        const task = await Task.findOne({
          where: { id: taskId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await task.destroy();

        return { removedTaskId: taskId };
      },
      moveActionToTask: async (root, { actionId, taskId }, { user }) => {
        const action = await Action.findById(actionId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });
        const sourceTask = await action.getTask();
        const targetTask = await Task.findById(taskId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });

        await action.setTask(targetTask);

        return { action, sourceTask, targetTask };
      },
      setProjectToTask: async (root, { taskId, projectId }, { user }) => {
        const task = await Task.findById(taskId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });
        const project = await Project.findById(projectId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });

        await task.setProject(project);

        return task;
      },
    },
  };
}
