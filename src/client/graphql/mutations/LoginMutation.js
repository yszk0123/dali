import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();

const mutation = graphql.experimental`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
      viewer {
        ...App_viewer
      }
    }
  }
`;

function commit(environment, { email, password }, user) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        email,
        password,
        clientMutationId: generateId(),
      },
    },
  });
}

export default { commit };
