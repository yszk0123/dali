import { MutationOptions } from 'apollo-client';
import {
  CreatePeriodMutationVariables as MutationVariables,
  CreatePeriodMutation as Mutation,
  PeriodPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/PeriodPage.graphql';
import * as mutation from '../mutationSchema/CreatePeriodMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
): MutationOptions<Mutation> {
  const { description, date, position } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      createPeriod: {
        __typename: 'Period',
        id: null,
        description: description || null,
        date,
        position,
        actions: [],
      },
    },
    update: (
      store,
      { data: { createPeriod } = { createPeriod: null } },
    ) => {
      const data = store.readQuery<Query>({ query, variables });
      if (!data.periods) {
        return;
      }

      data.periods.push(createPeriod);
      store.writeQuery({ query, data, variables });
    },
  };
}
