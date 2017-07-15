import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();

const mutation = graphql`
  mutation SignupMutation($input: SignupInput!) {
    signup(input: $input) {
      viewer {
        ...App_viewer
      }
    }
  }
`;

function commit(
  environment,
  { email, password, nickname, firstName, lastName },
  user,
) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        email,
        password,
        nickname,
        firstName,
        lastName,
        clientMutationId: generateId(),
      },
    },
  });
}

export default { commit };
