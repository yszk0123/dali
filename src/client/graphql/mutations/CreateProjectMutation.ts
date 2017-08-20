import { MutationOptions } from 'apollo-client';
import {
  CreateProjectMutationVariables as MutationVariables,
  CreateProjectMutation as Mutation,
  ProjectsPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/ProjectsPage.graphql';
import * as mutation from '../mutationSchema/CreateProjectMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
): MutationOptions<Mutation> {
  const { title } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      createProject: {
        __typename: 'Project',
        id: null,
        title,
      },
    },
    update: (store, { data: { createProject: project } }) => {
      const data = store.readQuery<Query>({ query, variables });
      data.projects.push(project);
      store.writeQuery({ query, data, variables });
    },
  };
}
