import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { first } from 'lodash';

export default function defineGraphQLLinkTaskUnitMutation({
  queries: {
    GraphQLTaskUnitEdge,
    GraphQLUser,
    GraphQLTimeUnitTaskUnitConnection,
  },
  models: { TaskUnit },
}) {
  const GraphQLLinkTaskUnitMutation = mutationWithClientMutationId({
    name: 'LinkTaskUnit',
    inputFields: {
      dailyScheduleId: { type: new GraphQLNonNull(GraphQLID) },
      taskUnitId: { type: new GraphQLNonNull(GraphQLID) },
      timeUnitId: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
      taskUnitEdge: {
        type: GraphQLTimeUnitTaskUnitConnection.edgeType,
        resolve: ({ taskUnit }) => {
          return GraphQLTimeUnitTaskUnitConnection.resolveEdge(taskUnit);
        },
      },
      viewer: {
        type: GraphQLUser,
        resolve: ({ user }) => user,
      },
    },
    mutateAndGetPayload: async (
      {
        dailyScheduleId: globalDailyScheduleId,
        taskUnitId: globalTaskUnitId,
        timeUnitId: globalTimeUnitId,
      },
      { user },
    ) => {
      const { id: localTimeUnitId } = fromGlobalId(globalTimeUnitId);
      const { id: localTaskUnitId } = fromGlobalId(globalTaskUnitId);
      const { id: localDailyScheduleId } = fromGlobalId(globalDailyScheduleId);
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
      const taskUnit = first(
        await user.getTaskUnits({
          where: { id: localTaskUnitId },
          rejectOnEmpty: true,
        }),
      );

      await timeUnit.addTaskUnit(taskUnit);

      return { taskUnit, user };
    },
  });

  return {
    GraphQLLinkTaskUnitMutation,
  };
}
