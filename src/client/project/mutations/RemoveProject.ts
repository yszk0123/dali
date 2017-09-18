import { MutationOptions } from 'apollo-client';
import {
  RemoveProjectMutationVariables as MutationVariables,
  RemoveProjectMutation as Mutation,
  ProjectPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/ProjectPage.graphql';
import * as mutation from '../mutationSchema/RemoveProjectMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
): MutationOptions<Mutation> {
  const { projectId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      removeProject: {
        __typename: 'RemoveProjectPayload',
        removedProjectId: projectId,
      },
    },
    update: (store, { data: { removeProject } = { removeProject: null } }) => {
      const data = store.readQuery<Query>({ query, variables });
      if (!removeProject || !data.projects) {
        return;
      }

      data.projects = data.projects.filter(
        (p: any) => p.id !== removeProject.removedProjectId,
      );
      store.writeQuery({ query, data, variables });
    },
  };
}
