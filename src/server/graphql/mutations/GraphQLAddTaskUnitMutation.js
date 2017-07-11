import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { first } from 'lodash';

export default function defineGraphQLAddTaskUnitMutation({
  queries: { GraphQLUser, GraphQLTimeUnitTaskUnitConnection },
  models: { TaskUnit },
}) {
  const GraphQLAddTaskUnitMutation = mutationWithClientMutationId({
    name: 'AddTaskUnit',
    inputFields: {
      dailyScheduleId: { type: new GraphQLNonNull(GraphQLID) },
      taskSetId: { type: new GraphQLNonNull(GraphQLID) },
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

      const taskUnit = await TaskUnit.create();
      await Promise.all([
        taskUnit.setTaskSet(taskSet),
        taskUnit.setTimeUnit(timeUnit),
      ]);

      return { taskUnit, user };
    },
  });

  return {
    GraphQLAddTaskUnitMutation,
  };
}
