import projectPageQuery from '../querySchema/ProjectsPage.graphql';
import query from '../mutationSchema/CreateProjectMutation.graphql';

async function commit(mutate, { title }) {
  await mutate({
    variables: {
      title,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      createProject: {
        __typename: 'Project',
        id: null,
        title,
      },
    },
    update: (store, { data: { createProject } }) => {
      const data = store.readQuery({ query: projectPageQuery });
      data.projects.push(createProject);
      store.writeQuery({ query: projectPageQuery, data });
    },
  });
}

export default { commit, query };
