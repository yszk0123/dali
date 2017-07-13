import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();

const mutation = graphql`
  mutation UpdateTaskSetMutation($input: UpdateTaskSetInput!) {
    updateTaskSet(input: $input) {
      taskSet {
        ...UpdateTaskSetTitleModal_taskSet
      }
    }
  }
`;

function commit(environment, { title }, taskSet) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
        taskSetId: taskSet.id,
        title,
      },
    },
    optimisticResponse: {
      updateTaskSet: {
        taskSet: {
          ...taskSet,
          title,
        },
      },
    },
  });
}

export default { commit };
