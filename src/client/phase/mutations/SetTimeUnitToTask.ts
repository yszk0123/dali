import { MutationOptions } from 'apollo-client';
import {
  SetTimeUnitToTaskMutationVariables as MutationVariables,
  SetTimeUnitToTaskMutation as Mutation,
} from 'schema';
import * as mutation from '../mutationSchema/SetTimeUnitToTaskMutation.graphql';

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
