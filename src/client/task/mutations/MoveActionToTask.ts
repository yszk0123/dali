import { defaults, pullAllBy } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  MoveActionToTaskMutationVariables as MutationVariables,
  MoveActionToTaskMutation as Mutation,
  TaskItem_taskFragment as Fragment,
  TaskActionItem_actionFragment,
} from 'schema';
import * as TaskItem_task from '../querySchema/TaskItem_task.graphql';
import * as mutation from '../mutationSchema/MoveActionToTaskMutation.graphql';
import { dataIdFromObject } from '../../shared/utils';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
): MutationOptions<Mutation> {
  const { actionId, taskId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    update: (
      store,
      { data: { moveActionToTask } = { moveActionToTask: null } },
    ) => {
      if (!moveActionToTask) {
        return;
      }
      const { sourceTask, targetTask } = moveActionToTask;
      if (!sourceTask || !targetTask) {
        return;
      }

      const oldTaskProxy = store.readFragment<Fragment>({
        fragment: TaskItem_task,
        fragmentName: 'TaskItem_task',
        variables,
        id: dataIdFromObject(sourceTask),
      });
      const newTaskProxy = store.readFragment<Fragment>({
        fragment: TaskItem_task,
        fragmentName: 'TaskItem_task',
        variables,
        id: dataIdFromObject(targetTask),
      });
      if (
        !oldTaskProxy ||
        !oldTaskProxy.actions ||
        !newTaskProxy ||
        !newTaskProxy.actions
      ) {
        return;
      }

      pullAllBy(oldTaskProxy.actions, [moveActionToTask.action], 'id');
      newTaskProxy.actions.push(moveActionToTask.action);

      store.writeFragment({
        fragment: TaskItem_task,
        fragmentName: 'TaskItem_task',
        data: oldTaskProxy,
        variables,
        id: dataIdFromObject(sourceTask),
      });
      store.writeFragment({
        fragment: TaskItem_task,
        fragmentName: 'TaskItem_task',
        data: newTaskProxy,
        variables,
        id: dataIdFromObject(targetTask),
      });
    },
  };
}
