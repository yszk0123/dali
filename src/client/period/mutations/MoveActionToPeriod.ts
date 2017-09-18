import { defaults, pullAllBy } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  MoveActionToPeriodMutationVariables as MutationVariables,
  MoveActionToPeriodMutation as Mutation,
  PeriodItem_periodFragment,
} from 'schema';
import * as PeriodItem_period from '../querySchema/PeriodItem_period.graphql';
import * as mutation from '../mutationSchema/MoveActionToPeriodMutation.graphql';
import { dataIdFromObject } from '../../shared/utils';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
): MutationOptions<Mutation> {
  const { actionId, periodId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    update: (
      store,
      { data: { moveActionToPeriod } = { moveActionToPeriod: null } },
    ) => {
      if (!moveActionToPeriod) {
        return;
      }
      const { sourcePeriod, targetPeriod } = moveActionToPeriod;
      if (!sourcePeriod || !targetPeriod) {
        return;
      }

      const oldPeriodProxy = store.readFragment<
        PeriodItem_periodFragment
      >({
        fragment: PeriodItem_period,
        fragmentName: 'PeriodItem_period',
        variables,
        id: dataIdFromObject(sourcePeriod),
      });
      const newPeriodProxy = store.readFragment<
        PeriodItem_periodFragment
      >({
        fragment: PeriodItem_period,
        fragmentName: 'PeriodItem_period',
        variables,
        id: dataIdFromObject(targetPeriod),
      });
      if (
        !oldPeriodProxy ||
        !oldPeriodProxy.actions ||
        !newPeriodProxy ||
        !newPeriodProxy.actions
      ) {
        return;
      }

      pullAllBy(oldPeriodProxy.actions, [moveActionToPeriod.action], 'id');
      newPeriodProxy.actions.push(moveActionToPeriod.action);

      store.writeFragment({
        fragment: PeriodItem_period,
        fragmentName: 'PeriodItem_period',
        data: oldPeriodProxy,
        variables,
        id: dataIdFromObject(sourcePeriod),
      });
      store.writeFragment({
        fragment: PeriodItem_period,
        fragmentName: 'PeriodItem_period',
        data: newPeriodProxy,
        variables,
        id: dataIdFromObject(targetPeriod),
      });
    },
  };
}
