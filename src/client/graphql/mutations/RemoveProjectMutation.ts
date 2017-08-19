import { RemoveProjectMutationMutationVariables } from 'schema';
import * as projectPageQuery from '../querySchema/ProjectsPage.graphql';
import * as query from '../mutationSchema/RemoveProjectMutation.graphql';

async function commit(
  mutate: any,
  { projectId }: RemoveProjectMutationMutationVariables,
) {
  await mutate({
    variables: {
      projectId,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      removeProject: {
        __typename: 'RemoveProjectPayload',
        removedProjectId: projectId,
      },
    },
    update: (
      store: any,
      { data: { removeProject: { removedProjectId } } }: any,
    ) => {
      const data = store.readQuery({ query: projectPageQuery });
      data.projects = data.projects.filter(
        (p: any) => p.id !== removedProjectId,
      );
      store.writeQuery({ query: projectPageQuery, data });
    },
  });
}

export default { commit, query };
