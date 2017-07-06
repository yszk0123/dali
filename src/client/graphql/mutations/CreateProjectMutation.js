import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();
const generateOptimisticId = makeIdGenerator('client:newCreateProject');

const mutation = graphql`
  mutation CreateProjectMutation($input: CreateProjectInput!) {
    createProject(input: $input) {
      projectEdge {
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
    'ProjectList_projects',
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
      const payload = store.getRootField('createProject');
      const newEdge = payload.getLinkedRecord('projectEdge');

      sharedUpdater(store, user, newEdge);
    },
    optimisticUpdater: store => {
      const id = generateOptimisticId();
      const node = store.create(id, 'Project');
      const newEdge = store.create(generateOptimisticId(), 'ProjectEdge');

      node.setValue(title, 'title');
      node.setValue(id, 'id');
      newEdge.setLinkedRecord(node, 'node');

      sharedUpdater(store, user, newEdge);
    },
  });
}

export default { commit };
