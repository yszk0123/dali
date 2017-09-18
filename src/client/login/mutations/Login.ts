import { MutationOptions } from 'apollo-client';
import {
  LoginMutationVariables as MutationVariables,
  LoginMutation as Mutation,
} from 'schema';
import * as mutation from '../mutationSchema/LoginMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
): MutationOptions<Mutation> {
  return {
    mutation,
    variables: mutationVariables,
  };
}
