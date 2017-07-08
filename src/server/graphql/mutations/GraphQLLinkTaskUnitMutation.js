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
      { taskUnitId: globalTaskUnitId, timeUnitId: globalTimeUnitId },
      { user },
    ) => {
      const { id: localTimeUnitId } = fromGlobalId(globalTimeUnitId);
      const { id: localTaskUnitId } = fromGlobalId(globalTaskUnitId);
      const timeUnit = first(
        await user.getTimeUnits({
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
