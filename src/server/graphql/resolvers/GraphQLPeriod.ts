import { camelCase, omitBy, isUndefined } from 'lodash';
import { IResolvers, IModels, IContext } from '../interfaces';
import { resolver } from '../utils';

interface Input {
  models: IModels;
}

export default function createResolvers({
  models: { Period, Action },
}: Input): IResolvers {
  return {
    Period: {
      owner: resolver(Period.Owner),
      actions: resolver(Period.Actions),
    },
    Query: {
      periods: resolver(Period, {
        list: true,
        before: (
          findOptions: any,
          { orderBy, before, after, date }: any,
          context: IContext,
        ) => {
          const where = { ...findOptions.where };

          if (orderBy) {
            findOptions.order = [[camelCase(orderBy.field), orderBy.direction]];
          }
          if (after) {
            Object.assign(where, { date: { $gte: after } });
          }
          if (before) {
            Object.assign(where, { date: { $lte: before } });
          }
          if (date) {
            Object.assign(where, { date });
          }

          // FIXME: findOptions.where = where;

          return findOptions;
        },
      }),
    },
    Mutation: {
      createPeriod: async (root, { description, date, position }, { user }) => {
        return await Period.create({
          ownerId: user.id,
          description,
          date,
          position,
        });
      },
      updatePeriod: async (
        root,
        { periodId, description, date, position },
        { user },
      ) => {
        const period = await Period.findOne({
          where: { id: periodId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await period.update(
          omitBy({ description, date, position }, isUndefined),
        );

        return period;
      },
      moveActionToPeriod: async (root, { actionId, periodId }, { user }) => {
        const action = await Action.findById(actionId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });
        const sourcePeriod = await action.getPeriod();
        const targetPeriod = await Period.findById(periodId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });

        await action.setPeriod(targetPeriod);

        return { action, sourcePeriod, targetPeriod };
      },
      removePeriod: async (root, { periodId }, { user }) => {
        const period = await Period.findOne({
          where: { id: periodId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await period.destroy();

        return { removedPeriodId: periodId };
      },
    },
  };
}
