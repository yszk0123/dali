import { MutationOptions } from 'apollo-client';
import {
  SetPeriodToActionMutationVariables as MutationVariables,
  SetPeriodToActionMutation as Mutation,
} from 'schema';
import * as mutation from '../mutationSchema/SetPeriodToActionMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
): MutationOptions<Mutation> {
  return {
    mutation,
    variables: mutationVariables,
  };
}
