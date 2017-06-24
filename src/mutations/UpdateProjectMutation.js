import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../common/makeIdGenerator';

const generateId = makeIdGenerator();
// const generateOptimisticId = makeIdGenerator('client:newUpdateProject');

const mutation = graphql`
  mutation UpdateProjectMutation($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      id
    }
  }
`;

function commit(environment, data, user) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
      },
    },
    updater: store => {},
    optimisticUpdater: store => {},
  });
}

export default { commit };
