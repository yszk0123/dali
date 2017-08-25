import { MutationOptions } from 'apollo-client';
import {
  RemovePhaseMutationVariables as MutationVariables,
  RemovePhaseMutation as Mutation,
  TasksPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/TasksPage.graphql';
import * as mutation from '../mutationSchema/RemovePhaseMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
): MutationOptions<Mutation> {
  const { phaseId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      removePhase: {
        __typename: 'RemovePhasePayload',
        removedPhaseId: phaseId,
      },
    },
    update: (store, { data: { removePhase } = { removePhase: null } }) => {
      const data = store.readQuery<Query>({ query, variables });
      if (!removePhase || !data.phases) {
        return;
      }

      data.phases = data.phases.filter(
        (p: any) => p.id !== removePhase.removedPhaseId,
      );
      store.writeQuery({ query, data, variables });
    },
  };
}
