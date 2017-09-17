import { MutationOptions } from 'apollo-client';
import {
  CreatePhaseTaskMutationVariables as MutationVariables,
  CreatePhaseTaskMutation as Mutation,
  PhaseItem_phaseFragment,
} from 'schema';
import * as PhaseItem_phase from '../querySchema/PhaseItem_phase.graphql';
import * as mutation from '../mutationSchema/CreatePhaseTaskMutation.graphql';
import dataIdFromObject from '../../shared/utils/dataIdFromObject';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
  phase: PhaseItem_phaseFragment,
): MutationOptions<Mutation> {
  const { title, description, done, phaseId, timeUnitId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      createTask: {
        __typename: 'Task',
        id: null,
        title,
        description,
        done: done || false,
        phaseId,
        phase: null,
        timeUnitId,
      },
    },
    update: (store, { data: { createTask } = { createTask: null } }) => {
      const data = store.readFragment<PhaseItem_phaseFragment>({
        fragment: PhaseItem_phase,
        fragmentName: 'PhaseItem_phase',
        variables,
        id: dataIdFromObject(phase),
      });
      if (!data || !data.tasks) {
        return;
      }

      data.tasks.push(createTask);
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
