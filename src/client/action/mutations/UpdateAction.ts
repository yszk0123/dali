import { defaults } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  UpdateActionMutationVariables as MutationVariables,
  UpdateActionMutation as Mutation,
  ActionPage_actionFragment,
} from 'schema';
import * as mutation from '../mutationSchema/UpdateActionMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  action: ActionPage_actionFragment,
): MutationOptions<Mutation> {
  return {
    mutation,
    variables: mutationVariables,
  };
}
