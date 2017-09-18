import { MutationOptions } from 'apollo-client';
import {
  RemoveTaskActionMutationVariables as MutationVariables,
  RemoveTaskActionMutation as Mutation,
  TaskItem_taskFragment,
} from 'schema';
import * as TaskItem_task from '../querySchema/TaskItem_task.graphql';
import * as mutation from '../mutationSchema/RemoveTaskActionMutation.graphql';
import { dataIdFromObject } from '../../shared/utils';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  task: TaskItem_taskFragment,
): MutationOptions<Mutation> {
  const { actionId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      removeAction: {
        __typename: 'RemoveActionPayload',
        removedActionId: actionId,
      },
    },
    update: (store, { data: { removeAction } = { removeAction: null } }) => {
      const data = store.readFragment<TaskItem_taskFragment>({
        fragment: TaskItem_task,
        fragmentName: 'TaskItem_task',
        variables,
        id: dataIdFromObject(task),
      });
      if (!data || !data.actions || !removeAction) {
        return;
      }

      data.actions = data.actions.filter(
        (p: any) => p.id !== removeAction.removedActionId,
      );
      store.writeFragment({
        fragment: TaskItem_task,
        fragmentName: 'TaskItem_task',
        data,
        variables,
        id: dataIdFromObject(task),
      });
    },
  };
}
