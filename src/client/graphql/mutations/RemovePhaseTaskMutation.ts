import { MutationOptions } from 'apollo-client';
import {
  RemovePhaseTaskMutationVariables as MutationVariables,
  RemovePhaseTaskMutation as Mutation,
  PhaseItem_phaseFragment,
} from 'schema';
import * as PhaseItem_phase from '../querySchema/PhaseItem_phase.graphql';
import * as mutation from '../mutationSchema/RemovePhaseTaskMutation.graphql';
import dataIdFromObject from '../../shared/utils/dataIdFromObject';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  phase: PhaseItem_phaseFragment,
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
      const data = store.readFragment<PhaseItem_phaseFragment>({
        fragment: PhaseItem_phase,
        fragmentName: 'PhaseItem_phase',
        variables,
        id: dataIdFromObject(phase),
      });
      if (!data || !data.tasks || !removeTask) {
        return;
      }

      data.tasks = data.tasks.filter(
        (p: any) => p.id !== removeTask.removedTaskId,
      );
      store.writeFragment({
        fragment: PhaseItem_phase,
        fragmentName: 'PhaseItem_phase',
        data,
        variables,
        id: dataIdFromObject(phase),
      });
    },
  };
}
