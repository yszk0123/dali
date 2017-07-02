import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();
// const generateOptimisticId = makeIdGenerator('client:newCreateTaskUnit');

const mutation = graphql`
  mutation CreateTaskUnitMutation($input: CreateTaskUnitInput!) {
    createTaskUnit(input: $input) {
      taskUnitEdge {
        node {
          id
        }
      }
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
