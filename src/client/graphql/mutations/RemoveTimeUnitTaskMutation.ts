import { MutationOptions } from 'apollo-client';
import {
  RemoveTimeUnitTaskMutationVariables as MutationVariables,
  RemoveTimeUnitTaskMutation as Mutation,
  TimeUnitItem_timeUnitFragment,
} from 'schema';
import * as PhaseItem_phase from '../querySchema/PhaseItem_phase.graphql';
import * as TimeUnitItem_timeUnit from '../querySchema/TimeUnitItem_timeUnit.graphql';
import * as mutation from '../mutationSchema/RemoveTaskMutation.graphql';
import dataIdFromObject from '../../shared/utils/dataIdFromObject';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  timeUnit: TimeUnitItem_timeUnitFragment,
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
      const data = store.readFragment<TimeUnitItem_timeUnitFragment>({
        fragment: TimeUnitItem_timeUnit,
        fragmentName: 'TimeUnitItem_timeUnit',
        variables,
        id: dataIdFromObject(timeUnit),
      });
      if (!data || !data.tasks || !removeTask) {
        return;
      }

      data.tasks = data.tasks.filter(
        (p: any) => p.id !== removeTask.removedTaskId,
      );
      store.writeFragment({
        fragment: TimeUnitItem_timeUnit,
        fragmentName: 'TimeUnitItem_timeUnit',
        data,
        variables,
        id: dataIdFromObject(timeUnit),
      });
    },
  };
}
