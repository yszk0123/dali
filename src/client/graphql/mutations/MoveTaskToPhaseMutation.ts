import { defaults, pullAllBy } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  MoveTaskToPhaseMutationVariables as MutationVariables,
  MoveTaskToPhaseMutation as Mutation,
  PhaseItem_phaseFragment as Fragment,
  TaskItem_taskFragment,
} from 'schema';
import * as fragment from '../querySchema/PhaseItem_phase.graphql';
import * as mutation from '../mutationSchema/MoveTaskToPhaseMutation.graphql';
import dataIdFromObject from '../../shared/utils/dataIdFromObject';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
): MutationOptions<Mutation> {
  const { taskId, phaseId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    update: (
      store,
      { data: { moveTaskToPhase } = { moveTaskToPhase: null } },
    ) => {
      if (!moveTaskToPhase) {
        return;
      }
      const { sourcePhase, targetPhase } = moveTaskToPhase;
      if (!sourcePhase || !targetPhase) {
        return;
      }

      const oldPhaseProxy = store.readFragment<Fragment>({
        fragment,
        variables,
        id: dataIdFromObject(sourcePhase),
        fragmentName: 'PhaseItem_phase',
      });
      const newPhaseProxy = store.readFragment<Fragment>({
        fragment,
        variables,
        id: dataIdFromObject(targetPhase),
        fragmentName: 'PhaseItem_phase',
      });
      if (
        !oldPhaseProxy ||
        !oldPhaseProxy.tasks ||
        !newPhaseProxy ||
        !newPhaseProxy.tasks
      ) {
        return;
      }

      pullAllBy(oldPhaseProxy.tasks, [moveTaskToPhase.task], 'id');
      newPhaseProxy.tasks.push(moveTaskToPhase.task);

      store.writeFragment({
        fragment,
        data: oldPhaseProxy,
        variables,
        id: dataIdFromObject(sourcePhase),
        fragmentName: 'PhaseItem_phase',
      });
      store.writeFragment({
        fragment,
        data: newPhaseProxy,
        variables,
        id: dataIdFromObject(targetPhase),
        fragmentName: 'PhaseItem_phase',
      });
    },
  };
}
