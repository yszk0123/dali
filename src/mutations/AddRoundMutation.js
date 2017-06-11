import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import makeIdGenerator from '../common/makeIdGenerator';

const generateId = makeIdGenerator();
const generateOptimisticId = makeIdGenerator('client:newRound');

const mutation = graphql`
  mutation AddRoundMutation($input: AddRoundInput!) {
    addRound(input: $input) {
      roundEdge {
        __typename
        cursor
        node {
          id
          title
        }
      }
    }
  }
`;

function sharedUpdater(store, user, newEdge) {
  const userProxy = store.get(user.id);
  const connection = ConnectionHandler.getConnection(
    userProxy,
    'RoundList_rounds',
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
      const payload = store.getRootField('addRound');
      const newEdge = payload.getLinkedRecord('roundEdge');

      sharedUpdater(store, user, newEdge);
    },
    optimisticUpdater: store => {
      const id = generateOptimisticId();
      const node = store.create(id, 'Round');
      node.setValue(title, 'title');
      node.setValue(id, 'id');

      const newEdge = store.create(generateOptimisticId(), 'RoundEdge');
      newEdge.setLinkedRecord(node, 'node');

      sharedUpdater(store, user, newEdge);
    },
  });
}

export default { commit };
