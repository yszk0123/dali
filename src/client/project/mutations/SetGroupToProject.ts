import { MutationOptions } from 'apollo-client';
import {
  SetGroupToProjectMutationVariables as MutationVariables,
  SetGroupToProjectMutation as Mutation,
} from 'schema';
import * as mutation from '../mutationSchema/SetGroupToProjectMutation.graphql';

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
