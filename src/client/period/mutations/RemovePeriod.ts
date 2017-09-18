import { MutationOptions } from 'apollo-client';
import {
  RemovePeriodMutationVariables as MutationVariables,
  RemovePeriodMutation as Mutation,
  PeriodPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/PeriodPage.graphql';
import * as mutation from '../mutationSchema/RemovePeriodMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
): MutationOptions<Mutation> {
  const { periodId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      removePeriod: {
        __typename: 'RemovePeriodPayload',
        removedPeriodId: periodId,
      },
    },
    update: (
      store,
      { data: { removePeriod } = { removePeriod: null } },
    ) => {
      const data = store.readQuery<Query>({ query, variables });
      if (!data.periods || !removePeriod) {
        return;
      }

      data.periods = data.periods.filter(
        (p: any) => p.id !== removePeriod.removedPeriodId,
      );
      store.writeQuery({ query, data, variables });
    },
  };
}
