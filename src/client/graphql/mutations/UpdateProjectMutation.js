import query from '../mutationSchema/UpdateProjectMutation.graphql';

async function commit(mutate, { title }, project) {
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
