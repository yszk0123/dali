import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';
import createRootVariables from '../../shared/boot/createRootVariables';

const generateId = makeIdGenerator();

const mutation = graphql.experimental`
  mutation SignupMutation($input: SignupInput!, $date: Date!) {
    signup(input: $input) {
      viewer {
        ...App_viewer @arguments(date: $date)
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
      ...createRootVariables(),
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
