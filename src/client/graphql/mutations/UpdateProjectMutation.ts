import {
  UpdateProjectMutationMutationVariables,
  ProjectItem_projectFragment,
} from 'schema';
import * as query from '../mutationSchema/UpdateProjectMutation.graphql';

async function commit(
  mutate: any,
  { title }: { title: string },
  project: ProjectItem_projectFragment,
) {
  await mutate({
    variables: {
      projectId: project.id,
      title,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      updateProject: {
        __typename: 'Project',
        ...project,
        title,
      },
    },
  });
}

export default { commit, query };
