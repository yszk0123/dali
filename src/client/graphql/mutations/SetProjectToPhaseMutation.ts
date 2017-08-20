import { MutationOptions } from 'apollo-client';
import {
  SetProjectToPhaseMutationVariables as MutationVariables,
  SetProjectToPhaseMutation as Mutation,
  ProjectsPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/ProjectsPage.graphql';
import * as mutation from '../mutationSchema/SetProjectToPhaseMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
): MutationOptions<Mutation> {
  const { projectId, phaseId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    update: (store, { data: { setProjectToPhase: phase } }) => {
      const data = store.readQuery<Query>({ query, variables });
      data.projects.push(phase);
      store.writeQuery({ query, data, variables });
    },
  };
}
