import { defaults } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  UpdateTaskMutationVariables as MutationVariables,
  UpdateTaskMutation as Mutation,
  TaskPage_taskFragment,
} from 'schema';
import * as mutation from '../mutationSchema/UpdateTaskMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  task: TaskPage_taskFragment,
): MutationOptions<Mutation> {
  return {
    mutation,
    variables: mutationVariables,
  };
}
