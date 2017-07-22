import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();

const mutation = graphql`
  mutation UpdateTaskUnitMutation($input: UpdateTaskUnitInput!) {
    updateTaskUnit(input: $input) {
      taskUnit {
        id
        done
        taskSet {
          id
          title
        }
      }
    }
  }
`;

function commit(environment, { done }, taskUnit, timeUnit, dailySchedule) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
        taskUnitId: taskUnit.id,
        timeUnitId: timeUnit.id,
        dailyScheduleId: dailySchedule.id,
        done,
      },
    },
    optimisticResponse: {
      updateTaskUnit: {
        taskUnit: {
          ...taskUnit,
          done,
        },
      },
    },
  });
}

export default { commit };
