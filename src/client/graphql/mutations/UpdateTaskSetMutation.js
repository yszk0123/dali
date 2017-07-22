import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();

const mutation = graphql`
  mutation UpdateTaskSetMutation($input: UpdateTaskSetInput!) {
    updateTaskSet(input: $input) {
      taskSet {
        id
        title
        ...TaskSetItem_taskSet
      }
    }
  }
`;

function commit(environment, { title, done }, taskSet) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
        taskSetId: taskSet.id,
        title,
        done,
      },
    },
    optimisticResponse: {
      updateTaskSet: {
        taskSet: {
          ...taskSet,
          title,
          done,
        },
      },
    },
  });
}

export default { commit };
