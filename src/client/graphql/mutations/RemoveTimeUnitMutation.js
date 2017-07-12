import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();

const mutation = graphql`
  mutation RemoveTimeUnitMutation($input: RemoveTimeUnitInput!) {
    removeTimeUnit(input: $input) {
      deletedTimeUnitId
    }
  }
`;

function sharedUpdater(store, dailySchedule, deletedTimeUnitId) {
  const dailyScheduleProxy = store.get(dailySchedule.id);
  const connection = ConnectionHandler.getConnection(
    dailyScheduleProxy,
    'TimeUnitList_timeUnits',
  );

  ConnectionHandler.deleteNode(connection, deletedTimeUnitId);
}

function commit(environment, timeUnit, dailySchedule) {
  function updater(store) {
    const payload = store.getRootField('removeTimeUnit');
    const deletedTimeUnitId = payload.getValue('deletedTimeUnitId');

    sharedUpdater(store, dailySchedule, deletedTimeUnitId);
  }

  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
        dailyScheduleId: dailySchedule.id,
        timeUnitId: timeUnit.id,
      },
    },
    updater,
    optimisticUpdater: updater,
    optimisticResponse: {
      removeTimeUnit: {
        deletedTimeUnitId: timeUnit.id,
      },
    },
  });
}

export default { commit };
