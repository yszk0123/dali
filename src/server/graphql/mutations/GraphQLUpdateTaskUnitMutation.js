import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { first, omitBy, isUndefined } from 'lodash';

export default function defineGraphQLUpdateTaskUnitMutation({
  queries: { GraphQLTaskUnit, GraphQLUser },
  models: { TaskUnit },
}) {
  const GraphQLUpdateTaskUnitMutation = mutationWithClientMutationId({
    name: 'UpdateTaskUnit',
    inputFields: {
      dailyScheduleId: { type: new GraphQLNonNull(GraphQLID) },
      timeUnitId: { type: new GraphQLNonNull(GraphQLID) },
      taskUnitId: { type: new GraphQLNonNull(GraphQLID) },
      done: { type: GraphQLString },
    },
    outputFields: {
      taskUnit: {
        type: GraphQLTaskUnit,
        resolve: ({ taskUnit }) => taskUnit,
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
        done,
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

      await taskUnit.update(omitBy({ done }, isUndefined));

      return { taskUnit, user };
    },
  });

  return {
    GraphQLUpdateTaskUnitMutation,
  };
}
