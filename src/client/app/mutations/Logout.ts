import { MutationOptions } from 'apollo-client';
import { LogoutMutation as Mutation } from 'schema';
import * as mutation from '../mutationSchema/LogoutMutation.graphql';

type QueryVariables = {};
type MutationVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables = {},
  variables: QueryVariables = {},
): MutationOptions<Mutation> {
  return {
    mutation,
    variables: mutationVariables,
  };
}
