import { MutationOptions } from 'apollo-client';
import {
  RemovePeriodActionMutationVariables as MutationVariables,
  RemovePeriodActionMutation as Mutation,
  PeriodItem_periodFragment,
} from 'schema';
import * as PeriodItem_period from '../querySchema/PeriodItem_period.graphql';
import * as mutation from '../mutationSchema/RemovePeriodActionMutation.graphql';
import { dataIdFromObject } from '../../shared/utils';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  period: PeriodItem_periodFragment,
): MutationOptions<Mutation> {
  const { actionId } = mutationVariables;

  return {
    mutation,
    variables: {
      ...mutationVariables,
      periodId: null,
    },
    update: (store, { data: { action } = { action: null } }) => {
      const data = store.readFragment<PeriodItem_periodFragment>({
        fragment: PeriodItem_period,
        fragmentName: 'PeriodItem_period',
        variables,
        id: dataIdFromObject(period),
      });
      if (!data || !data.actions || !action) {
        return;
      }

      data.actions = data.actions.filter((p: any) => p.id !== action.id);
      store.writeFragment({
        fragment: PeriodItem_period,
        fragmentName: 'PeriodItem_period',
        data,
        variables,
        id: dataIdFromObject(period),
      });
    },
  };
}
