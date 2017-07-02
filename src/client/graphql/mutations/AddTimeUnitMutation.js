import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();
const generateOptimisticId = makeIdGenerator('client:newTimeUnit');

const mutation = graphql`
  mutation AddTimeUnitMutation($input: AddTimeUnitInput!) {
    addTimeUnit(input: $input) {
      id
    }
  }
`;

function sharedUpdater(store, user, newEdge) {
  const userProxy = store.get(user.id);
  const connection = ConnectionHandler.getConnection(
    userProxy,
    'TimeUnitList_timeUnits',
  );

  ConnectionHandler.insertEdgeAfter(connection, newEdge);
}

function commit(environment, { title }, user) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        title,
        clientMutationId: generateId(),
      },
    },
    updater: store => {
      const payload = store.getRootField('addTimeUnit');
      const newEdge = payload.getLinkedRecord('timeUnitEdge');

      sharedUpdater(store, user, newEdge);
    },
    optimisticUpdater: store => {
      const id = generateOptimisticId();
      const node = store.create(id, 'TimeUnit');
      node.setValue(title, 'title');
      node.setValue(id, 'id');

      const newEdge = store.create(generateOptimisticId(), 'TimeUnitEdge');
      newEdge.setLinkedRecord(node, 'node');

      sharedUpdater(store, user, newEdge);
    },
  });
}

export default { commit };
