import { defaults, pullAllBy } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  MoveTaskToTimeUnitMutationVariables as MutationVariables,
  MoveTaskToTimeUnitMutation as Mutation,
  TimeUnitItem_timeUnitFragment,
} from 'schema';
import * as TimeUnitItem_timeUnit from '../querySchema/TimeUnitItem_timeUnit.graphql';
import * as mutation from '../mutationSchema/MoveTaskToTimeUnitMutation.graphql';
import dataIdFromObject from '../../shared/utils/dataIdFromObject';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
): MutationOptions<Mutation> {
  const { taskId, timeUnitId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    update: (
      store,
      { data: { moveTaskToTimeUnit } = { moveTaskToTimeUnit: null } },
    ) => {
      if (!moveTaskToTimeUnit) {
        return;
      }
      const { sourceTimeUnit, targetTimeUnit } = moveTaskToTimeUnit;
      if (!sourceTimeUnit || !targetTimeUnit) {
        return;
      }

      const oldTimeUnitProxy = store.readFragment<
        TimeUnitItem_timeUnitFragment
      >({
        fragment: TimeUnitItem_timeUnit,
        fragmentName: 'TimeUnitItem_timeUnit',
        variables,
        id: dataIdFromObject(sourceTimeUnit),
      });
      const newTimeUnitProxy = store.readFragment<
        TimeUnitItem_timeUnitFragment
      >({
        fragment: TimeUnitItem_timeUnit,
        fragmentName: 'TimeUnitItem_timeUnit',
        variables,
        id: dataIdFromObject(targetTimeUnit),
      });
      if (
        !oldTimeUnitProxy ||
        !oldTimeUnitProxy.tasks ||
        !newTimeUnitProxy ||
        !newTimeUnitProxy.tasks
      ) {
        return;
      }

      pullAllBy(oldTimeUnitProxy.tasks, [moveTaskToTimeUnit.task], 'id');
      newTimeUnitProxy.tasks.push(moveTaskToTimeUnit.task);

      store.writeFragment({
        fragment: TimeUnitItem_timeUnit,
        fragmentName: 'TimeUnitItem_timeUnit',
        data: oldTimeUnitProxy,
        variables,
        id: dataIdFromObject(sourceTimeUnit),
      });
      store.writeFragment({
        fragment: TimeUnitItem_timeUnit,
        fragmentName: 'TimeUnitItem_timeUnit',
        data: newTimeUnitProxy,
        variables,
        id: dataIdFromObject(targetTimeUnit),
      });
    },
  };
}
