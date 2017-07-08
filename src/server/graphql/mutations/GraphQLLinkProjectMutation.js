import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { first } from 'lodash';

export default function defineGraphQLLinkProjectMutation({
  queries: { GraphQLProject, GraphQLUser },
  models: { TaskUnit },
}) {
  const GraphQLLinkProjectMutation = mutationWithClientMutationId({
    name: 'LinkProject',
    inputFields: {
      projectId: { type: new GraphQLNonNull(GraphQLID) },
      taskUnitId: { type: new GraphQLNonNull(GraphQLID) },
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
      { taskUnitId: globalTaskUnitId, projectId: globalProjectId },
      { user },
    ) => {
      const { id: localTaskUnitId } = fromGlobalId(globalTaskUnitId);
      const { id: localProjectId } = fromGlobalId(globalProjectId);
      const taskUnit = first(
        await user.getTaskUnits({
          where: { id: localTaskUnitId },
          rejectOnEmpty: true,
        }),
      );
      const project = first(
        await user.getProjects({
          where: { id: localProjectId },
          rejectOnEmpty: true,
        }),
      );

      await taskUnit.setProject(project);

      return { project, user };
    },
  });

  return {
    GraphQLLinkProjectMutation,
  };
}
