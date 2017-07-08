import { GraphQLNonNull, GraphQLInt, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import firstOrThrow from '../../shared/utils/firstOrThrow';

export default function defineGraphQLAddTimeUnitMutation({
  queries: {
    GraphQLTimeUnitEdge,
    GraphQLUser,
    GraphQLDailyScheduleTimeUnitConnection,
  },
  models: { TimeUnit },
}) {
  const GraphQLAddTimeUnitMutation = mutationWithClientMutationId({
    name: 'AddTimeUnit',
    inputFields: {
      dailyScheduleId: { type: new GraphQLNonNull(GraphQLID) },
      position: { type: new GraphQLNonNull(GraphQLInt) },
    },
    outputFields: {
      timeUnitEdge: {
        type: GraphQLDailyScheduleTimeUnitConnection.edgeType,
        resolve: ({ timeUnit }) => {
          return GraphQLDailyScheduleTimeUnitConnection.resolveEdge(timeUnit);
        },
      },
      viewer: {
        type: GraphQLUser,
        resolve: ({ user }) => user,
      },
    },
    mutateAndGetPayload: async (
      { dailyScheduleId: globalId, position },
      { user },
    ) => {
      const { id: localId } = fromGlobalId(globalId);
      const dailySchedule = firstOrThrow(
        await user.getDailySchedules({ where: { id: localId } }),
      );

      const timeUnit = await TimeUnit.create({ position });
      await dailySchedule.addTimeUnit(timeUnit);

      return { timeUnit, user };
    },
  });

  return {
    GraphQLAddTimeUnitMutation,
  };
}
