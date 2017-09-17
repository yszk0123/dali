import { MutationOptions } from 'apollo-client';
import {
  CreateTimeUnitTaskMutationVariables as MutationVariables,
  CreateTimeUnitTaskMutation as Mutation,
  TimeUnitItem_timeUnitFragment,
} from 'schema';
import * as TimeUnitItem_timeUnit from '../querySchema/TimeUnitItem_timeUnit.graphql';
import * as mutation from '../mutationSchema/CreateTimeUnitTaskMutation.graphql';
import dataIdFromObject from '../../shared/utils/dataIdFromObject';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
  timeUnit: TimeUnitItem_timeUnitFragment,
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
      const data = store.readFragment<TimeUnitItem_timeUnitFragment>({
        fragment: TimeUnitItem_timeUnit,
        fragmentName: 'TimeUnitItem_timeUnit',
        variables,
        id: dataIdFromObject(timeUnit),
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
        id: dataIdFromObject(timeUnit),
      });
    },
  };
}
