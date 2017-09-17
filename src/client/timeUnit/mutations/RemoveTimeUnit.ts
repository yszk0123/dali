import { MutationOptions } from 'apollo-client';
import {
  RemoveTimeUnitMutationVariables as MutationVariables,
  RemoveTimeUnitMutation as Mutation,
  TimeUnitPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/TimeUnitPage.graphql';
import * as mutation from '../mutationSchema/RemoveTimeUnitMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
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
    update: (
      store,
      { data: { removeTimeUnit } = { removeTimeUnit: null } },
    ) => {
      const data = store.readQuery<Query>({ query, variables });
      if (!data.timeUnits || !removeTimeUnit) {
        return;
      }

      data.timeUnits = data.timeUnits.filter(
        (p: any) => p.id !== removeTimeUnit.removedTimeUnitId,
      );
      store.writeQuery({ query, data, variables });
    },
  };
}
