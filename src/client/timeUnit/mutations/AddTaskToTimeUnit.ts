import { MutationOptions } from 'apollo-client';
import {
  AddTaskToTimeUnitMutationVariables as MutationVariables,
  AddTaskToTimeUnitMutation as Mutation,
  TimeUnitItem_timeUnitFragment,
} from 'schema';
import * as TimeUnitItem_timeUnit from '../querySchema/TimeUnitItem_timeUnit.graphql';
import * as mutation from '../mutationSchema/AddTaskToTimeUnitMutation.graphql';
import { dataIdFromObject } from '../../shared/utils';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
  timeUnit: TimeUnitItem_timeUnitFragment,
): MutationOptions<Mutation> {
  const { timeUnitId, taskId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    update: (store, { data: { task } = { task: null } }) => {
      const data = store.readFragment<TimeUnitItem_timeUnitFragment>({
        fragment: TimeUnitItem_timeUnit,
        fragmentName: 'TimeUnitItem_timeUnit',
        variables,
        id: dataIdFromObject(timeUnit),
      });
      if (!data || !data.tasks) {
        return;
      }

      data.tasks.push(task);
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
