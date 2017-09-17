import { MutationOptions } from 'apollo-client';
import {
  CreateTimeUnitMutationVariables as MutationVariables,
  CreateTimeUnitMutation as Mutation,
  TimeUnitPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/TimeUnitPage.graphql';
import * as mutation from '../mutationSchema/CreateTimeUnitMutation.graphql';

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
      createTimeUnit: {
        __typename: 'TimeUnit',
        id: null,
        description: description || null,
        date,
        position,
        tasks: [],
      },
    },
    update: (
      store,
      { data: { createTimeUnit } = { createTimeUnit: null } },
    ) => {
      const data = store.readQuery<Query>({ query, variables });
      if (!data.timeUnits) {
        return;
      }

      data.timeUnits.push(createTimeUnit);
      store.writeQuery({ query, data, variables });
    },
  };
}
