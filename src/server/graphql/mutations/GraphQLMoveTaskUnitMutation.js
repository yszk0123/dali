import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { first } from 'lodash';

export default function defineGraphQLMoveTaskUnitMutation({
  queries: { GraphQLUser, GraphQLTimeUnitTaskUnitConnection },
  models: { TaskUnit },
}) {
  const GraphQLMoveTaskUnitMutation = mutationWithClientMutationId({
    name: 'MoveTaskUnit',
    inputFields: {
      dailyScheduleId: { type: new GraphQLNonNull(GraphQLID) },
      taskUnitId: { type: new GraphQLNonNull(GraphQLID) },
      fromTimeUnitId: { type: new GraphQLNonNull(GraphQLID) },
      toTimeUnitId: { type: new GraphQLNonNull(GraphQLID) },
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
        fromTimeUnitId: globalFromTimeUnitId,
        toTimeUnitId: globalToTimeUnitId,
      },
      { user },
    ) => {
      const { id: localFromTimeUnitId } = fromGlobalId(globalFromTimeUnitId);
      const { id: localToTimeUnitId } = fromGlobalId(globalToTimeUnitId);
      const { id: localTaskUnitId } = fromGlobalId(globalTaskUnitId);
      const { id: localDailyScheduleId } = fromGlobalId(globalDailyScheduleId);
      const dailySchedule = first(
        await user.getDailySchedules({
          where: { id: localDailyScheduleId },
          rejectOnEmpty: true,
        }),
      );
      const fromTimeUnit = first(
        await dailySchedule.getTimeUnits({
          where: { id: localFromTimeUnitId },
          rejectOnEmpty: true,
        }),
      );
      const toTimeUnit = first(
        await dailySchedule.getTimeUnits({
          where: { id: localToTimeUnitId },
          rejectOnEmpty: true,
        }),
      );
      const taskUnit = first(
        await fromTimeUnit.getTaskUnits({
          where: { id: localTaskUnitId },
          rejectOnEmpty: true,
        }),
      );

      await Promise.all([taskUnit.setTimeUnit(toTimeUnit)]);

      return { taskUnit, user };
    },
  });

  return {
    GraphQLMoveTaskUnitMutation,
  };
}
