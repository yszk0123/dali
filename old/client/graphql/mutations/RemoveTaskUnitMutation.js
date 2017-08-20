import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();

const mutation = graphql`
  mutation RemoveTaskUnitMutation($input: RemoveTaskUnitInput!) {
    removeTaskUnit(input: $input) {
      deletedTaskUnitId
    }
  }
`;

function sharedUpdater(store, timeUnit, deletedTaskUnitId) {
  const timeUnitProxy = store.get(timeUnit.id);
  const connection = ConnectionHandler.getConnection(
    timeUnitProxy,
    'TimeUnitItem_taskUnits',
  );

  ConnectionHandler.deleteNode(connection, deletedTaskUnitId);
}

function commit(environment, taskUnit, timeUnit, dailySchedule) {
  function updater(store) {
    const payload = store.getRootField('removeTaskUnit');
    const deletedTaskUnitId = payload.getValue('deletedTaskUnitId');

    sharedUpdater(store, timeUnit, deletedTaskUnitId);
  }

  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
        dailyScheduleId: dailySchedule.id,
        timeUnitId: timeUnit.id,
        taskUnitId: taskUnit.id,
      },
    },
    updater,
    optimisticUpdater: updater,
    optimisticResponse: {
      removeTaskUnit: {
        deletedTaskUnitId: taskUnit.id,
      },
    },
  });
}

export default { commit };
