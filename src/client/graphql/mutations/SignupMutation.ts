import { MutationOptions } from 'apollo-client';
import {
  SignupMutationVariables as MutationVariables,
  SignupMutation as Mutation,
} from 'schema';
import * as mutation from '../mutationSchema/SignupMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
): MutationOptions<Mutation> {
  return {
    mutation,
    variables: mutationVariables,
  };
}
