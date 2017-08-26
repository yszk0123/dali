import { defaults } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  UpdateTimeUnitTaskMutationVariables as MutationVariables,
  UpdateTimeUnitTaskMutation as Mutation,
  TimeUnitTaskItem_taskFragment,
} from 'schema';
import * as mutation from '../mutationSchema/UpdateTimeUnitTaskMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  task: TimeUnitTaskItem_taskFragment,
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
