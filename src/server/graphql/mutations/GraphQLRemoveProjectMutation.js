import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { first } from 'lodash';

export default function defineGraphQLRemoveProjectMutation({
  queries: { GraphQLProjectEdge, GraphQLUser, GraphQLUserProjectConnection },
  models: { Project },
}) {
  const GraphQLRemoveProjectMutation = mutationWithClientMutationId({
    name: 'RemoveProject',
    inputFields: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
      deletedProjectId: {
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

      // TODO: Implement User#getProject which throws Error
      // when the project is not found.
      const project = first(
        await user.getProjects({ where: { id: localId }, rejectOnEmpty: true }),
      );
      project.destroy();

      return { id: globalId, user };
    },
  });

  return {
    GraphQLRemoveProjectMutation,
  };
}
