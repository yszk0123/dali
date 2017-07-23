import { GraphQLNonNull, GraphQLBoolean, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { omitBy, isUndefined } from 'lodash';

export default function defineGraphQLCreateTaskSetMutation({
  queries: { GraphQLUser, GraphQLUserTaskSetConnection },
  models: { TaskSet },
}) {
  const GraphQLCreateTaskSetMutation = mutationWithClientMutationId({
    name: 'CreateTaskSet',
    inputFields: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      done: { type: GraphQLBoolean },
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
    mutateAndGetPayload: async ({ title, done }, { user }) => {
      const taskSet = await TaskSet.create(
        omitBy({ title, done }, isUndefined),
      );

      await user.addTaskSet(taskSet);

      return { taskSet, user };
    },
  });

  return {
    GraphQLCreateTaskSetMutation,
  };
}
