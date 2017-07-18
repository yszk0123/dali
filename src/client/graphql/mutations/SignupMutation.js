import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';
import createRootVariables from '../../shared/boot/createRootVariables';

const generateId = makeIdGenerator();

const mutation = graphql.experimental`
  mutation SignupMutation($input: SignupInput!, $defaultDate: Date!) {
    signup(input: $input) {
      viewer {
        ...App_viewer @arguments(date: $defaultDate)
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
    onCompleted: () => {
      window.location.reload();
    },
  });
}

export default { commit };
