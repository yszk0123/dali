import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();
const generateOptimisticId = makeIdGenerator('client:newCreateTaskSet');

const mutation = graphql`
  mutation CreateTaskSetMutation($input: CreateTaskSetInput!) {
    createTaskSet(input: $input) {
      taskSetEdge {
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
    'TaskSetList_taskSets',
  );

  ConnectionHandler.insertEdgeAfter(connection, newEdge);
}

function commit(environment, { title }, user) {
  function updater(store) {
    const payload = store.getRootField('createTaskSet');
    const newEdge = payload.getLinkedRecord('taskSetEdge');

    sharedUpdater(store, user, newEdge);
  }

  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        title,
        clientMutationId: generateId(),
      },
    },
    updater,
    optimisticUpdater: updater,
    optimisticResponse: {
      createTaskSet: {
        taskSetEdge: {
          node: {
            id: generateOptimisticId(),
            title,
          },
        },
      },
    },
  });
}

export default { commit };
