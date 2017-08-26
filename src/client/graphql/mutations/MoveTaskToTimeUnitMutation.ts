import { defaults, pullAllBy } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  MoveTaskToTimeUnitMutationVariables as MutationVariables,
  MoveTaskToTimeUnitMutation as Mutation,
  TimeUnitItem_timeUnitFragment as Fragment,
  TaskItem_taskFragment,
} from 'schema';
import * as fragment from '../querySchema/TimeUnitItem.graphql';
import * as mutation from '../mutationSchema/MoveTaskToTimeUnitMutation.graphql';
import dataIdFromObject from '../../shared/utils/dataIdFromObject';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
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

      const oldTimeUnitProxy = store.readFragment<Fragment>({
        fragment,
        variables,
        id: dataIdFromObject(sourceTimeUnit),
        fragmentName: 'TimeUnitItem_timeUnit',
      });
      const newTimeUnitProxy = store.readFragment<Fragment>({
        fragment,
        variables,
        id: dataIdFromObject(targetTimeUnit),
        fragmentName: 'TimeUnitItem_timeUnit',
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
        fragment,
        data: oldTimeUnitProxy,
        variables,
        id: dataIdFromObject(sourceTimeUnit),
        fragmentName: 'TimeUnitItem_timeUnit',
      });
      store.writeFragment({
        fragment,
        data: newTimeUnitProxy,
        variables,
        id: dataIdFromObject(targetTimeUnit),
        fragmentName: 'TimeUnitItem_timeUnit',
      });
    },
  };
}
