import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();
const generateOptimisticId = makeIdGenerator('client:newCreateTaskUnit');

const mutation = graphql`
  mutation CreateTaskUnitMutation($input: CreateTaskUnitInput!) {
    createTaskUnit(input: $input) {
      taskUnitEdge {
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
    'TaskUnitList_taskUnits',
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
      const payload = store.getRootField('createTaskUnit');
      const newEdge = payload.getLinkedRecord('taskUnitEdge');

      sharedUpdater(store, user, newEdge);
    },
    optimisticUpdater: store => {
      const id = generateOptimisticId();
      const node = store.create(id, 'TaskUnit');
      const newEdge = store.create(generateOptimisticId(), 'TaskUnitEdge');

      node.setValue(title, 'title');
      node.setValue(id, 'id');
      newEdge.setLinkedRecord(node, 'node');

      sharedUpdater(store, user, newEdge);
    },
  });
}

export default { commit };
