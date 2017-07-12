import { GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { first } from 'lodash';

export default function defineGraphQLLinkProjectMutation({
  queries: { GraphQLProject, GraphQLTaskSet, GraphQLUser },
  models: { TaskSet },
}) {
  const GraphQLLinkProjectMutation = mutationWithClientMutationId({
    name: 'LinkProject',
    inputFields: {
      projectId: { type: new GraphQLNonNull(GraphQLID) },
      taskSetId: { type: new GraphQLNonNull(GraphQLID) },
    },
    outputFields: {
      project: {
        type: GraphQLProject,
        resolve: ({ project }) => project,
      },
      taskSet: {
        type: GraphQLTaskSet,
        resolve: ({ taskSet }) => taskSet,
      },
      viewer: {
        type: GraphQLUser,
        resolve: ({ user }) => user,
      },
    },
    mutateAndGetPayload: async (
      { taskSetId: globalTaskSetId, projectId: globalProjectId },
      { user },
    ) => {
      const { id: localTaskSetId } = fromGlobalId(globalTaskSetId);
      const { id: localProjectId } = fromGlobalId(globalProjectId);
      const taskSet = first(
        await user.getTaskSets({
          where: { id: localTaskSetId },
          rejectOnEmpty: true,
        }),
      );
      const project = first(
        await user.getProjects({
          where: { id: localProjectId },
          rejectOnEmpty: true,
        }),
      );

      await taskSet.setProject(project);

      return { project, taskSet, user };
    },
  });

  return {
    GraphQLLinkProjectMutation,
  };
}
