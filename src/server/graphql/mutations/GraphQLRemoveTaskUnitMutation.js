import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import firstOrThrow from '../../shared/utils/firstOrThrow';

export default function defineGraphQLRemoveTaskUnitMutation({
  queries: { GraphQLTaskUnitEdge, GraphQLUser, GraphQLUserTaskUnitConnection },
  models: { TaskUnit },
}) {
  const GraphQLRemoveTaskUnitMutation = mutationWithClientMutationId({
    name: 'RemoveTaskUnit',
    inputFields: {
      id: { type: new GraphQLNonNull(GraphQLID) },
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
    mutateAndGetPayload: async ({ id: globalId }, { user }) => {
      const { id: localId } = fromGlobalId(globalId);

      // TODO: Implement User#getTaskUnit which throws Error
      // when the taskUnit is not found.
      const taskUnit = firstOrThrow(
        await user.getTaskUnits({ where: { id: localId } }),
      );
      taskUnit.destroy();

      return { id: globalId, user };
    },
  });

  return {
    GraphQLRemoveTaskUnitMutation,
  };
}
