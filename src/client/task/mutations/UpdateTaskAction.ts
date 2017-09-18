import { defaults } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  UpdateTaskActionMutationVariables as MutationVariables,
  UpdateTaskActionMutation as Mutation,
  TaskActionItem_actionFragment,
} from 'schema';
import * as mutation from '../mutationSchema/UpdateTaskActionMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  action: TaskActionItem_actionFragment,
): MutationOptions<Mutation> {
  const { title, description, done, taskId, periodId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      updateAction: {
        __typename: 'Action',
        ...defaults({ title, description, done, taskId, periodId }, action),
      },
    },
  };
}
