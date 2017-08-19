/* @flow */
import { resolver } from 'graphql-sequelize';
import { camelCase, omitBy, isUndefined } from 'lodash';
import type { IResolvers, IModels } from '../interfaces';

type Input = {
  models: IModels,
};

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
        before: (findOptions, { orderBy }, context) => {
          if (orderBy) {
            findOptions.order = [[camelCase(orderBy.field), orderBy.direction]];
          }

          return findOptions;
        },
      }),
    },
    Mutation: {
      createTimeUnit: async (
        root,
        { description, wholeDay, startAt, endAt },
        { user },
      ) => {
        return await TimeUnit.create({
          ownerId: user.id,
          description,
          wholeDay,
          startAt,
          endAt,
        });
      },
      updateTimeUnit: async (
        root,
        { taskGroupId, description, wholeDay, startAt, endAt },
        { user },
      ) => {
        const timeUnit = await TimeUnit.findOne({
          where: { id: taskGroupId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await timeUnit.update(
          omitBy({ description, wholeDay, startAt, endAt }, isUndefined),
        );

        return timeUnit;
      },
      removeTimeUnit: async (root, { taskGroupId }, { user }) => {
        const task = await TimeUnit.findOne({
          where: { id: taskGroupId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await task.destroy();

        return { removedTimeUnitId: taskGroupId };
      },
    },
  };
}
