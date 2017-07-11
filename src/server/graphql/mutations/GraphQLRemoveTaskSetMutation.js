import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { first } from 'lodash';

export default function defineGraphQLRemoveTaskSetMutation({
  queries: { GraphQLTaskSetEdge, GraphQLUser, GraphQLUserTaskSetConnection },
  models: { TaskSet },
}) {
  const GraphQLRemoveTaskSetMutation = mutationWithClientMutationId({
    name: 'RemoveTaskSet',
    inputFields: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
      deletedTaskSetId: {
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

      // TODO: Implement User#getTaskSet which throws Error
      // when the taskSet is not found.
      const taskSet = first(
        await user.getTaskSets({
          where: { id: localId },
          rejectOnEmpty: true,
        }),
      );
      taskSet.destroy();

      return { id: globalId, user };
    },
  });

  return {
    GraphQLRemoveTaskSetMutation,
  };
}
