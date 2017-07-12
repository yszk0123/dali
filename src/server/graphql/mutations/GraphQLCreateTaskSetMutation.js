import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

export default function defineGraphQLCreateTaskSetMutation({
  queries: { GraphQLUser, GraphQLUserTaskSetConnection },
  models: { TaskSet },
}) {
  const GraphQLCreateTaskSetMutation = mutationWithClientMutationId({
    name: 'CreateTaskSet',
    inputFields: {
      title: { type: new GraphQLNonNull(GraphQLString) },
    },
    outputFields: {
      taskSetEdge: {
        type: GraphQLUserTaskSetConnection.edgeType,
        resolve: ({ taskSet }) => {
          return GraphQLUserTaskSetConnection.resolveEdge(taskSet);
        },
      },
      viewer: {
        type: GraphQLUser,
        resolve: ({ user }) => user,
      },
    },
    mutateAndGetPayload: async ({ title }, { user }) => {
      const taskSet = await TaskSet.create({ title });

      await user.addTaskSet(taskSet);

      return { taskSet, user };
    },
  });

  return {
    GraphQLCreateTaskSetMutation,
  };
}
