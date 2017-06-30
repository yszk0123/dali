import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

export default function defineGraphQLCreateTaskUnitMutation({
  GraphQLTaskUnitEdge,
  GraphQLUser,
  GraphQLUserTaskUnitConnection,
  TaskUnit,
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
      // TODO: Implement
      // viewer: {
      //   type: GraphQLUser,
      //   resolve: () => User.findOne(),
      // },
    },
    mutateAndGetPayload: ({ title }) => {
      const taskUnit = TaskUnit.create({ title });

      return { taskUnit };
    },
  });

  return {
    GraphQLCreateTaskUnitMutation,
  };
}
