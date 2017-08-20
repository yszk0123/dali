import { MutationOptions } from 'apollo-client';
import {
  RemoveTimeUnitMutationVariables as MutationVariables,
  RemoveTimeUnitMutation as Mutation,
  SchedulePageQuery as Query,
} from 'schema';
import * as query from '../querySchema/SchedulePage.graphql';
import * as mutation from '../mutationSchema/RemoveTimeUnitMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
): MutationOptions<Mutation> {
  const { timeUnitId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      removeTimeUnit: {
        __typename: 'RemoveTimeUnitPayload',
        removedTimeUnitId: timeUnitId,
      },
    },
    update: (store, { data: { removeTimeUnit: { removedTimeUnitId } } }) => {
      const data = store.readQuery<Query>({ query, variables });
      data.timeUnits = data.timeUnits.filter(
        (p: any) => p.id !== removedTimeUnitId,
      );
      store.writeQuery({ query, data, variables });
    },
  };
}
