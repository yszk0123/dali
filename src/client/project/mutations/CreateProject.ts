import { MutationOptions } from 'apollo-client';
import {
  CreateProjectMutationVariables as MutationVariables,
  CreateProjectMutation as Mutation,
  ProjectPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/ProjectPage.graphql';
import * as mutation from '../mutationSchema/CreateProjectMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
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
    update: (
      store,
      { data: { createProject: project } = { createProject: null } },
    ) => {
      const data = store.readQuery<Query>({ query, variables });
      if (!data.projects) {
        return;
      }

      data.projects.push(project);
      store.writeQuery({ query, data, variables });
    },
  };
}
