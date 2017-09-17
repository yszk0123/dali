import { defaults } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  UpdateTimeUnitMutationVariables as MutationVariables,
  UpdateTimeUnitMutation as Mutation,
  TimeUnitItem_timeUnitFragment,
} from 'schema';
import * as mutation from '../mutationSchema/UpdateTimeUnitMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  timeUnit: TimeUnitItem_timeUnitFragment,
): MutationOptions<Mutation> {
  const { description, date, position, timeUnitId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      updateTimeUnit: {
        __typename: 'TimeUnit',
        ...defaults({ description, date, position, timeUnitId }, timeUnit),
      },
    },
  };
}
