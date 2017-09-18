import { MutationOptions } from 'apollo-client';
import {
  AddActionToPeriodMutationVariables as MutationVariables,
  AddActionToPeriodMutation as Mutation,
  PeriodItem_periodFragment,
} from 'schema';
import * as PeriodItem_period from '../querySchema/PeriodItem_period.graphql';
import * as mutation from '../mutationSchema/AddActionToPeriodMutation.graphql';
import { dataIdFromObject } from '../../shared/utils';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
  period: PeriodItem_periodFragment,
): MutationOptions<Mutation> {
  const { periodId, actionId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    update: (store, { data: { action } = { action: null } }) => {
      const data = store.readFragment<PeriodItem_periodFragment>({
        fragment: PeriodItem_period,
        fragmentName: 'PeriodItem_period',
        variables,
        id: dataIdFromObject(period),
      });
      if (!data || !data.actions) {
        return;
      }

      data.actions.push(action);
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
