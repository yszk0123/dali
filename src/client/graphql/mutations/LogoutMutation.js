import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';
import createRootVariables from '../../shared/boot/createRootVariables';

const generateId = makeIdGenerator();

const mutation = graphql.experimental`
  mutation LogoutMutation($input: LogoutInput!, $date: Date!) {
    logout(input: $input) {
      viewer {
        ...App_viewer @arguments(date: $date)
      }
    }
  }
`;

function commit(environment) {
  return commitMutation(environment, {
    mutation,
    variables: {
      ...createRootVariables(),
      input: {
        clientMutationId: generateId(),
      },
    },
  });
}

export default { commit };
