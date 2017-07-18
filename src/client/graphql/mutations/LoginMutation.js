import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';
import createRootVariables from '../../shared/boot/createRootVariables';

const generateId = makeIdGenerator();

const mutation = graphql.experimental`
  mutation LoginMutation($input: LoginInput!, $defaultDate: Date!) {
    login(input: $input) {
      viewer {
        ...App_viewer @arguments(date: $defaultDate)
      }
    }
  }
`;

function commit(environment, { email, password }, user) {
  return commitMutation(environment, {
    mutation,
    variables: {
      ...createRootVariables(),
      input: {
        email,
        password,
        clientMutationId: generateId(),
      },
    },
    onCompleted: () => {
      window.location.reload();
    },
  });
}

export default { commit };
