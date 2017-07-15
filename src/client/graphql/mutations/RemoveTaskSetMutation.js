import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation RemoveTaskSetMutation($input: RemoveTaskSetInput!) {
    removeTaskSet(input: $input) {
      deletedTaskSetId
    }
  }
`;

function sharedUpdater(store, user, deletedId) {
  const userProxy = store.get(user.id);
  const connection = ConnectionHandler.getConnection(
    userProxy,
    'TaskSetList_taskSets',
  );

  ConnectionHandler.deleteNode(connection, deletedId);
}

function commit(environment, taskSet, user) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        id: taskSet.id,
      },
    },
    updater: store => {
      const payload = store.getRootField('removeTaskSet');

      sharedUpdater(store, user, payload.getValue('deletedTaskSetId'));
    },
    optimisticUpdater: store => {
      sharedUpdater(store, user, taskSet.id);
    },
  });
}

export default { commit };