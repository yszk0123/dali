import { MutationOptions } from 'apollo-client';
import {
  SetProjectToPhaseMutationVariables as MutationVariables,
  SetProjectToPhaseMutation as Mutation,
  TaskPageQuery as Query,
} from 'schema';
import * as mutation from '../mutationSchema/SetProjectToPhaseMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
): MutationOptions<Mutation> {
  const { projectId, phaseId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    // update: (
    //   store,
    //   { data: { setProjectToPhase: phase } = { setProjectToPhase: null } },
    // ) => {
    //   const data = store.readQuery<Query>({ query, variables });
    //   if (!data.projects) {
    //     return;
    //   }

    //   data.projects.push(phase);
    //   store.writeQuery({ query, data, variables });
    // },
  };
}
