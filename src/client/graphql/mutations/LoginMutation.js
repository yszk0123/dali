import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';
import createRootVariables from '../../shared/boot/createRootVariables';

const generateId = makeIdGenerator();

const mutation = graphql.experimental`
  mutation LoginMutation($input: LoginInput!, $date: Date!) {
    login(input: $input) {
      viewer {
        ...App_viewer @arguments(date: $date)
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
  });
}

export default { commit };
