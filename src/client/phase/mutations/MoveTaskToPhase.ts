import { defaults, pullAllBy } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  MoveTaskToPhaseMutationVariables as MutationVariables,
  MoveTaskToPhaseMutation as Mutation,
  PhaseItem_phaseFragment as Fragment,
  PhaseTaskItem_taskFragment,
} from 'schema';
import * as PhaseItem_phase from '../querySchema/PhaseItem_phase.graphql';
import * as mutation from '../mutationSchema/MoveTaskToPhaseMutation.graphql';
import dataIdFromObject from '../../shared/utils/dataIdFromObject';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
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
        fragment: PhaseItem_phase,
        fragmentName: 'PhaseItem_phase',
        variables,
        id: dataIdFromObject(sourcePhase),
      });
      const newPhaseProxy = store.readFragment<Fragment>({
        fragment: PhaseItem_phase,
        fragmentName: 'PhaseItem_phase',
        variables,
        id: dataIdFromObject(targetPhase),
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
        fragment: PhaseItem_phase,
        fragmentName: 'PhaseItem_phase',
        data: oldPhaseProxy,
        variables,
        id: dataIdFromObject(sourcePhase),
      });
      store.writeFragment({
        fragment: PhaseItem_phase,
        fragmentName: 'PhaseItem_phase',
        data: newPhaseProxy,
        variables,
        id: dataIdFromObject(targetPhase),
      });
    },
  };
}
