import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { first, omitBy, isUndefined } from 'lodash';

export default function defineGraphQLUpdateProjectMutation({
  queries: { GraphQLProject, GraphQLUser },
  models: { Project },
}) {
  const GraphQLUpdateProjectMutation = mutationWithClientMutationId({
    name: 'UpdateProject',
    inputFields: {
      projectId: { type: new GraphQLNonNull(GraphQLID) },
      title: { type: GraphQLString },
    },
    outputFields: {
      project: {
        type: GraphQLProject,
        resolve: ({ project }) => project,
      },
      viewer: {
        type: GraphQLUser,
        resolve: ({ user }) => user,
      },
    },
    mutateAndGetPayload: async (
      { projectId: globalProjectId, title },
      { user },
    ) => {
      const { id: localProjectId } = fromGlobalId(globalProjectId);
      const project = first(
        await user.getProjects({
          where: { id: localProjectId },
          rejectOnEmpty: true,
        }),
      );

      await project.update(omitBy({ title }, isUndefined));

      return { project, user };
    },
  });

  return {
    GraphQLUpdateProjectMutation,
  };
}
