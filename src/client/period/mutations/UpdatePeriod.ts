import { defaults } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  UpdatePeriodMutationVariables as MutationVariables,
  UpdatePeriodMutation as Mutation,
  PeriodItem_periodFragment,
} from 'schema';
import * as mutation from '../mutationSchema/UpdatePeriodMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  period: PeriodItem_periodFragment,
): MutationOptions<Mutation> {
  const { description, date, position, periodId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      updatePeriod: {
        __typename: 'Period',
        ...defaults({ description, date, position, periodId }, period),
      },
    },
  };
}
