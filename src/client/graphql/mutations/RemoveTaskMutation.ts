import { MutationOptions } from 'apollo-client';
import {
  RemoveTaskMutationVariables as MutationVariables,
  RemoveTaskMutation as Mutation,
  PhaseItem_phaseFragment as Fragment,
} from 'schema';
import * as fragment from '../querySchema/PhaseItem.graphql';
import * as mutation from '../mutationSchema/RemoveTaskMutation.graphql';

type QueryVariables = {};

export interface Options {
  phaseId?: string;
}

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  options: Options,
): MutationOptions<Mutation> {
  const { taskId } = mutationVariables;
  const { phaseId } = options;

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
      if (phaseId) {
        const data = store.readFragment<Fragment>({
          fragment,
          variables,
          id: phaseId,
        });
        if (!data || !data.tasks || !removeTask) {
          return;
        }

        data.tasks = data.tasks.filter(
          (p: any) => p.id !== removeTask.removedTaskId,
        );
        store.writeFragment({
          fragment,
          data,
          variables,
          id: phaseId,
        });
      }
    },
  };
}
