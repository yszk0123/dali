import { defaults } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  UpdatePhaseTaskMutationVariables as MutationVariables,
  UpdatePhaseTaskMutation as Mutation,
  TaskItem_taskFragment,
} from 'schema';
import * as mutation from '../mutationSchema/UpdatePhaseTaskMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  task: TaskItem_taskFragment,
): MutationOptions<Mutation> {
  const { title, description, done, phaseId, timeUnitId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      updateTask: {
        __typename: 'Task',
        ...defaults({ title, description, done, phaseId, timeUnitId }, task),
      },
    },
  };
}