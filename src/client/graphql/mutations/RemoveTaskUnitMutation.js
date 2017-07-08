import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation RemoveTaskUnitMutation($input: RemoveTaskUnitInput!) {
    removeTaskUnit(input: $input) {
      deletedTaskUnitId
    }
  }
`;

function sharedUpdater(store, user, deletedId) {
  const userProxy = store.get(user.id);
  const connection = ConnectionHandler.getConnection(
    userProxy,
    'TaskUnitList_taskUnits',
  );

  ConnectionHandler.deleteNode(connection, deletedId);
}

function commit(environment, taskUnit, user) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        id: taskUnit.id,
      },
    },
    updater: store => {
      const payload = store.getRootField('removeTaskUnit');

      sharedUpdater(store, user, payload.getValue('deletedTaskUnitId'));
    },
    optimisticUpdater: store => {
      sharedUpdater(store, user, taskUnit.id);
    },
  });
}

export default { commit };
