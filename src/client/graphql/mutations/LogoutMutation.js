import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';
import createRootVariables from '../../shared/boot/createRootVariables';

const generateId = makeIdGenerator();

const mutation = graphql.experimental`
  mutation LogoutMutation($input: LogoutInput!, $defaultDate: Date!) {
    logout(input: $input) {
      viewer {
        ...App_viewer @arguments(date: $defaultDate)
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
    onCompleted: () => {
      window.location.reload();
    },
  });
}

export default { commit };
