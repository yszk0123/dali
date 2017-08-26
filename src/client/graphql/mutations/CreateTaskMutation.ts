import { MutationOptions } from 'apollo-client';
import {
  CreateTaskMutationVariables as MutationVariables,
  CreateTaskMutation as Mutation,
  PhaseItem_phaseFragment,
  TimeUnitItem_timeUnitFragment,
} from 'schema';
import * as PhaseItem_phase from '../querySchema/PhaseItem_phase.graphql';
import * as TimeUnitItem_timeUnit from '../querySchema/TimeUnitItem_timeUnit.graphql';
import * as mutation from '../mutationSchema/CreateTaskMutation.graphql';
import dataIdFromObject from '../../shared/utils/dataIdFromObject';

type QueryVariables = {};

export interface Options {
  phase?: PhaseItem_phaseFragment;
  timeUnit?: TimeUnitItem_timeUnitFragment;
}

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
  options: Options = {},
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
      if (options.phase) {
        const data = store.readFragment<PhaseItem_phaseFragment>({
          fragment: PhaseItem_phase,
          fragmentName: 'PhaseItem_phase',
          variables,
          id: dataIdFromObject(options.phase),
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
          id: dataIdFromObject(options.phase),
        });
      }

      if (options.timeUnit) {
        const data = store.readFragment<TimeUnitItem_timeUnitFragment>({
          fragment: TimeUnitItem_timeUnit,
          fragmentName: 'TimeUnitItem_timeUnit',
          variables,
          id: dataIdFromObject(options.timeUnit),
        });
        if (!data || !data.tasks) {
          return;
        }

        data.tasks.push(createTask);
        store.writeFragment({
          fragment: TimeUnitItem_timeUnit,
          fragmentName: 'TimeUnitItem_timeUnit',
          data,
          variables,
          id: dataIdFromObject(options.timeUnit),
        });
      }
    },
  };
}
