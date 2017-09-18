import { MutationOptions } from 'apollo-client';
import {
  CreateTaskActionMutationVariables as MutationVariables,
  CreateTaskActionMutation as Mutation,
  TaskItem_taskFragment,
} from 'schema';
import * as TaskItem_task from '../querySchema/TaskItem_task.graphql';
import * as mutation from '../mutationSchema/CreateTaskActionMutation.graphql';
import { dataIdFromObject } from '../../shared/utils';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
  task: TaskItem_taskFragment,
): MutationOptions<Mutation> {
  const { title, description, done, taskId, periodId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      createAction: {
        __typename: 'Action',
        id: null,
        title,
        description,
        done: done || false,
        taskId,
        task: null,
        periodId,
      },
    },
    update: (store, { data: { createAction } = { createAction: null } }) => {
      const data = store.readFragment<TaskItem_taskFragment>({
        fragment: TaskItem_task,
        fragmentName: 'TaskItem_task',
        variables,
        id: dataIdFromObject(task),
      });
      if (!data || !data.actions) {
        return;
      }

      data.actions.push(createAction);
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
