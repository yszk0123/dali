import { MutationOptions } from 'apollo-client';
import {
  RemoveTimeUnitTaskMutationVariables as MutationVariables,
  RemoveTimeUnitTaskMutation as Mutation,
  TimeUnitItem_timeUnitFragment,
} from 'schema';
import * as TimeUnitItem_timeUnit from '../querySchema/TimeUnitItem_timeUnit.graphql';
import * as mutation from '../mutationSchema/RemoveTimeunitTaskMutation.graphql';
import dataIdFromObject from '../../shared/utils/dataIdFromObject';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  timeUnit: TimeUnitItem_timeUnitFragment,
): MutationOptions<Mutation> {
  const { taskId } = mutationVariables;

  return {
    mutation,
    variables: {
      ...mutationVariables,
      timeUnitId: null,
    },
    update: (store, { data: { task } = { task: null } }) => {
      const data = store.readFragment<TimeUnitItem_timeUnitFragment>({
        fragment: TimeUnitItem_timeUnit,
        fragmentName: 'TimeUnitItem_timeUnit',
        variables,
        id: dataIdFromObject(timeUnit),
      });
      if (!data || !data.tasks || !task) {
        return;
      }

      data.tasks = data.tasks.filter((p: any) => p.id !== task.id);
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
