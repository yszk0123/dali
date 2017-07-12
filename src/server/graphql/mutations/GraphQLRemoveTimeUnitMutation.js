import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { first } from 'lodash';

export default function defineGraphQLRemoveTimeUnitMutation({
  queries: { GraphQLUser, GraphQLDailyScheduleTimeUnitConnection },
  models: { TimeUnit },
}) {
  const GraphQLRemoveTimeUnitMutation = mutationWithClientMutationId({
    name: 'RemoveTimeUnit',
    inputFields: {
      dailyScheduleId: { type: new GraphQLNonNull(GraphQLID) },
      timeUnitId: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
      deletedTimeUnitId: {
        type: GraphQLID,
        resolve: ({ id }) => id,
      },
      viewer: {
        type: GraphQLUser,
        resolve: ({ user }) => user,
      },
    },
    mutateAndGetPayload: async (
      { dailyScheduleId: globalDailyScheduleId, timeUnitId: globalTimeUnitId },
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

      await timeUnit.destroy();

      return { id: globalTimeUnitId, user };
    },
  });

  return {
    GraphQLRemoveTimeUnitMutation,
  };
}
