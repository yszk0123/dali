import { resolver } from 'graphql-sequelize';
import { camelCase, omitBy, isUndefined } from 'lodash';
import { IResolvers, IModels, IContext } from '../interfaces';

interface Input {
  models: IModels;
}

export default function createResolvers({
  models: { TimeUnit },
}: Input): IResolvers {
  return {
    TimeUnit: {
      owner: resolver(TimeUnit.Owner),
      tasks: resolver(TimeUnit.Tasks),
    },
    Query: {
      timeUnits: resolver(TimeUnit, {
        list: true,
        before: (
          findOptions: any,
          { orderBy, before, after, date }: any,
          context: IContext,
        ) => {
          const where = {};

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

          return findOptions;
        },
      }),
    },
    Mutation: {
      createTimeUnit: async (
        root,
        { description, date, position },
        { user },
      ) => {
        return await TimeUnit.create({
          ownerId: user.id,
          description,
          date,
          position,
        });
      },
      updateTimeUnit: async (
        root,
        { timeUnitId, description, date, position },
        { user },
      ) => {
        const timeUnit = await TimeUnit.findOne({
          where: { id: timeUnitId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await timeUnit.update(
          omitBy({ description, date, position }, isUndefined),
        );

        return timeUnit;
      },
      removeTimeUnit: async (root, { timeUnitId }, { user }) => {
        const timeUnit = await TimeUnit.findOne({
          where: { id: timeUnitId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await timeUnit.destroy();

        return { removedTimeUnitId: timeUnitId };
      },
    },
  };
}
