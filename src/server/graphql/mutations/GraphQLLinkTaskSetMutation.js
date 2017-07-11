import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { first } from 'lodash';

export default function defineGraphQLLinkTaskSetMutation({
  queries: {
    GraphQLTaskSetEdge,
    GraphQLUser,
    GraphQLTimeUnitTaskSetConnection,
  },
  models: { TaskSet },
}) {
  const GraphQLLinkTaskSetMutation = mutationWithClientMutationId({
    name: 'LinkTaskSet',
    inputFields: {
      dailyScheduleId: { type: new GraphQLNonNull(GraphQLID) },
      taskSetId: { type: new GraphQLNonNull(GraphQLID) },
      timeUnitId: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
      taskSetEdge: {
        type: GraphQLTimeUnitTaskSetConnection.edgeType,
        resolve: ({ taskSet }) => {
          return GraphQLTimeUnitTaskSetConnection.resolveEdge(taskSet);
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
        taskSetId: globalTaskSetId,
        timeUnitId: globalTimeUnitId,
      },
      { user },
    ) => {
      const { id: localTimeUnitId } = fromGlobalId(globalTimeUnitId);
      const { id: localTaskSetId } = fromGlobalId(globalTaskSetId);
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
      const taskSet = first(
        await user.getTaskSets({
          where: { id: localTaskSetId },
          rejectOnEmpty: true,
        }),
      );

      await timeUnit.addTaskSet(taskSet);

      return { taskSet, user };
    },
  });

  return {
    GraphQLLinkTaskSetMutation,
  };
}
