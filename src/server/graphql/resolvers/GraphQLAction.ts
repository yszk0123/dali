import { camelCase, omitBy, isUndefined } from 'lodash';
import { IResolvers, IModels, IContext } from '../interfaces';
import { resolver } from '../utils';

interface Input {
  models: IModels;
}

export default function createResolvers({
  models: { Action, Period, Task },
}: Input): IResolvers {
  return {
    Action: {
      owner: resolver(Action.Owner),
      task: resolver(Action.Task),
      period: resolver(Action.Period),
      assignee: resolver(Action.Assignee),
    },
    Query: {
      action: resolver(Action),
      actions: resolver(Action, {
        list: true,
        before: (findOptions: any, { used }: any, context: IContext) => {
          const where = { ...findOptions.where };

          if (used != null) {
            Object.assign(where, { periodId: used ? { $not: null } : null });
          }

          findOptions.where = where;

          return findOptions;
        },
      }),
    },
    Mutation: {
      createAction: async (
        root,
        { title, description, done, taskId, periodId, assigneeId },
        { user },
      ) => {
        return await Action.create({
          title,
          description,
          done,
          taskId,
          periodId,
          assigneeId,
          ownerId: user.id,
        });
      },
      updateAction: async (
        root,
        { actionId, title, description, done, taskId, periodId, assigneeId },
        { user },
      ) => {
        const action = await Action.findOne({
          where: { id: actionId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await action.update(
          omitBy(
            { title, description, done, taskId, periodId, assigneeId },
            isUndefined,
          ),
        );

        return action;
      },
      removeAction: async (root, { actionId }, { user }) => {
        const action = await Action.findOne({
          where: { id: actionId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await action.destroy();

        return { removedActionId: actionId };
      },
      setTaskToAction: async (root, { taskId, actionId }, { user }) => {
        const task = await Task.findOne({
          where: { id: taskId, ownerId: user.id },
          rejectOnEmpty: true,
        });
        const action = await Action.findOne({
          where: { id: actionId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await action.setTask(task);

        return action;
      },
      setPeriodToAction: async (root, { periodId, actionId }, { user }) => {
        const period = await Period.findOne({
          where: { id: periodId, ownerId: user.id },
          rejectOnEmpty: true,
        });
        const action = await Action.findOne({
          where: { id: actionId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await action.setPeriod(period);

        return action;
      },
      setOrCreatePeriodToAction: async (
        root,
        { date, position, actionId },
        { user },
      ) => {
        const [period, _created] = await Period.findOrCreate({
          where: { date, position, ownerId: user.id },
          defaults: { date, position, ownerId: user.id },
        });
        const action = await Action.findOne({
          where: { id: actionId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await action.setPeriod(period);

        return action;
      },
    },
  };
}
