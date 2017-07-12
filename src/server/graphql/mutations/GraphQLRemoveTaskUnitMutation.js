import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { first } from 'lodash';

export default function defineGraphQLRemoveTaskUnitMutation({
  queries: { GraphQLUser, GraphQLDailyScheduleTaskUnitConnection },
  models: { TaskUnit },
}) {
  const GraphQLRemoveTaskUnitMutation = mutationWithClientMutationId({
    name: 'RemoveTaskUnit',
    inputFields: {
      dailyScheduleId: { type: new GraphQLNonNull(GraphQLID) },
      timeUnitId: { type: new GraphQLNonNull(GraphQLID) },
      taskUnitId: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
      deletedTaskUnitId: {
        type: GraphQLID,
        resolve: ({ id }) => id,
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
        taskUnitId: globalTaskUnitId,
      },
      { user },
    ) => {
      const { id: localDailyScheduleId } = fromGlobalId(globalDailyScheduleId);
      const { id: localTimeUnitId } = fromGlobalId(globalTimeUnitId);
      const { id: localTaskUnitId } = fromGlobalId(globalTaskUnitId);
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
        await timeUnit.getTaskUnits({
          where: { id: localTaskUnitId },
          rejectOnEmpty: true,
        }),
      );

      await taskUnit.destroy();

      return { id: globalTaskUnitId, user };
    },
  });

  return {
    GraphQLRemoveTaskUnitMutation,
  };
}
