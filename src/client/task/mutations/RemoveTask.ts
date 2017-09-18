import { MutationOptions } from 'apollo-client';
import {
  RemoveTaskMutationVariables as MutationVariables,
  RemoveTaskMutation as Mutation,
  TaskPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/TaskPage.graphql';
import * as mutation from '../mutationSchema/RemoveTaskMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
): MutationOptions<Mutation> {
  const { taskId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      removeTask: {
        __typename: 'RemoveTaskPayload',
        removedTaskId: taskId,
      },
    },
    update: (store, { data: { removeTask } = { removeTask: null } }) => {
      const data = store.readQuery<Query>({ query, variables });
      if (!removeTask || !data.tasks) {
        return;
      }

      data.tasks = data.tasks.filter(
        (p: any) => p.id !== removeTask.removedTaskId,
      );
      store.writeQuery({ query, data, variables });
    },
  };
}
