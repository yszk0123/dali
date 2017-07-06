import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation RemoveProjectMutation($input: RemoveProjectInput!) {
    removeProject(input: $input) {
      deletedProjectId
    }
  }
`;

function sharedUpdater(store, user, deletedId) {
  const userProxy = store.get(user.id);
  const connection = ConnectionHandler.getConnection(
    userProxy,
    'ProjectList_projects',
  );

  ConnectionHandler.deleteNode(connection, deletedId);
}

function commit(environment, project, user) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        id: project.id,
      },
    },
    updater: store => {
      const payload = store.getRootField('removeProject');

      sharedUpdater(store, user, payload.getValue('deletedProjectId'));
    },
    optimisticUpdater: store => {
      sharedUpdater(store, user, project.id);
    },
  });
}

export default { commit };
