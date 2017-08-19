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
          done
          title
          ...TaskSetItem_taskSet
        }
      }
    }
  }
`;

function sharedUpdater(store, user, newEdge, filter) {
  const userProxy = store.get(user.id);
  const connection = ConnectionHandler.getConnection(
    userProxy,
    'TaskSetList_taskSets',
    filter,
  );

  ConnectionHandler.insertEdgeAfter(connection, newEdge);
}

function commit(environment, { title, done }, user) {
  const filter = { done };

  function updater(store) {
    const payload = store.getRootField('createTaskSet');
    const newEdge = payload.getLinkedRecord('taskSetEdge');

    sharedUpdater(store, user, newEdge, filter);
  }

  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        title,
        done,
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
            done,
            title,
          },
        },
      },
    },
  });
}

export default { commit };
