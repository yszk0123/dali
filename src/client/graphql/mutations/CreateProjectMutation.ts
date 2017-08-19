import { CreateProjectMutationMutationVariables } from 'schema';
import * as projectPageQuery from '../querySchema/ProjectsPage.graphql';
import * as query from '../mutationSchema/CreateProjectMutation.graphql';

async function commit(
  mutate: any,
  { title }: CreateProjectMutationMutationVariables,
) {
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
    update: (store: any, { data: { createProject } }: any) => {
      const data = store.readQuery({ query: projectPageQuery });
      data.projects.push(createProject);
      store.writeQuery({ query: projectPageQuery, data });
    },
  });
}

export default { commit, query };
