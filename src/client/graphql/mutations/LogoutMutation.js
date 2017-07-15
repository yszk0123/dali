import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();

const mutation = graphql`
  mutation LogoutMutation($input: LogoutInput!) {
    logout(input: $input) {
      viewer {
        ...App_viewer
      }
    }
  }
`;

function commit(environment) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
      },
    },
  });
}

export default { commit };
