import projectPageQuery from '../querySchema/ProjectsPage.graphql';
import query from '../mutationSchema/RemoveProjectMutation.graphql';

async function commit(mutate, { projectId }) {
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
    update: (store, { data: { removeProject: { removedProjectId } } }) => {
      const data = store.readQuery({ query: projectPageQuery });
      data.projects = data.projects.filter(p => p.id !== removedProjectId);
      store.writeQuery({ query: projectPageQuery, data });
    },
  });
}

export default { commit, query };
