import { defaults } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  UpdateTaskMutationVariables as MutationVariables,
  UpdateTaskMutation as Mutation,
  TaskItem_taskFragment,
} from 'schema';
import * as mutation from '../mutationSchema/UpdateTaskMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
  task: TaskItem_taskFragment,
): MutationOptions<Mutation> {
  const { title, description, done, projectId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      updateTask: {
        __typename: 'Task',
        ...defaults({ title, description, done, projectId }, task),
      },
    },
  };
}
