import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

export default function defineGraphQLCreateTaskUnitMutation({
  queries: { GraphQLTaskUnitEdge, GraphQLUser, GraphQLUserTaskUnitConnection },
  models: { TaskUnit },
}) {
  const GraphQLCreateTaskUnitMutation = mutationWithClientMutationId({
    name: 'CreateTaskUnit',
    inputFields: {
      title: { type: new GraphQLNonNull(GraphQLString) },
    },
    outputFields: {
      taskUnitEdge: {
        type: GraphQLUserTaskUnitConnection.edgeType,
        resolve: ({ taskUnit }) => {
          return GraphQLUserTaskUnitConnection.resolveEdge(taskUnit);
        },
      },
      viewer: {
        type: GraphQLUser,
        resolve: ({ user }) => user,
      },
    },
    mutateAndGetPayload: async ({ title }, { user }) => {
      const taskUnit = await TaskUnit.create({ title });

      await user.addTaskUnit(taskUnit);

      return { taskUnit, user };
    },
  });

  return {
    GraphQLCreateTaskUnitMutation,
  };
}
