import { defaults } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  UpdatePhaseMutationVariables as MutationVariables,
  UpdatePhaseMutation as Mutation,
  PhaseItem_phaseFragment,
} from 'schema';
import * as mutation from '../mutationSchema/UpdatePhaseMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
  phase: PhaseItem_phaseFragment,
): MutationOptions<Mutation> {
  const { title, description, done, projectId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      updatePhase: {
        __typename: 'Phase',
        ...defaults({ title, description, done, projectId }, phase),
      },
    },
  };
}
