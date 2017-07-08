import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

export default function defineGraphQLCreateProjectMutation({
  queries: { GraphQLProjectEdge, GraphQLUser, GraphQLUserProjectConnection },
  models: { Project },
}) {
  const GraphQLCreateProjectMutation = mutationWithClientMutationId({
    name: 'CreateProject',
    inputFields: {
      title: { type: new GraphQLNonNull(GraphQLString) },
    },
    outputFields: {
      projectEdge: {
        type: GraphQLUserProjectConnection.edgeType,
        resolve: ({ project }) => {
          return GraphQLUserProjectConnection.resolveEdge(project);
        },
      },
      viewer: {
        type: GraphQLUser,
        resolve: ({ user }) => user,
      },
    },
    mutateAndGetPayload: async ({ title }, { user }) => {
      const project = await Project.create({ title });

      await user.addProject(project);

      return { project, user };
    },
  });

  return {
    GraphQLCreateProjectMutation,
  };
}
