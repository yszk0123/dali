import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { first, omitBy, isUndefined } from 'lodash';

export default function defineGraphQLUpdateTimeUnitMutation({
  queries: { GraphQLTimeUnit, GraphQLUser },
  models: { TimeUnit },
}) {
  const GraphQLUpdateTimeUnitMutation = mutationWithClientMutationId({
    name: 'UpdateTimeUnit',
    inputFields: {
      dailyScheduleId: { type: new GraphQLNonNull(GraphQLID) },
      timeUnitId: { type: new GraphQLNonNull(GraphQLID) },
      title: { type: GraphQLString },
    },
    outputFields: {
      timeUnit: {
        type: GraphQLTimeUnit,
        resolve: ({ timeUnit }) => timeUnit,
      },
      viewer: {
        type: GraphQLUser,
        resolve: ({ user }) => user,
      },
    },
    mutateAndGetPayload: async (
      {
        dailyScheduleId: globalDailyScheduleId,
        timeUnitId: globalTimeUnitId,
        title,
      },
      { user },
    ) => {
      const { id: localDailyScheduleId } = fromGlobalId(globalDailyScheduleId);
      const { id: localTimeUnitId } = fromGlobalId(globalTimeUnitId);
      const dailySchedule = first(
        await user.getDailySchedules({
          where: { id: localDailyScheduleId },
          rejectOnEmpty: true,
        }),
      );
      const timeUnit = first(
        await dailySchedule.getTimeUnits({
          where: { id: localTimeUnitId },
          rejectOnEmpty: true,
        }),
      );

      await timeUnit.update(omitBy({ title }, isUndefined));

      return { timeUnit, user };
    },
  });

  return {
    GraphQLUpdateTimeUnitMutation,
  };
}
