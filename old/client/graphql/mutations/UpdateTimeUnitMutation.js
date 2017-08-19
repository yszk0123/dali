import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();

const mutation = graphql`
  mutation UpdateTimeUnitMutation($input: UpdateTimeUnitInput!) {
    updateTimeUnit(input: $input) {
      timeUnit {
        id
        title
      }
    }
  }
`;

function commit(environment, { title }, timeUnit, dailySchedule) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
        dailyScheduleId: dailySchedule.id,
        timeUnitId: timeUnit.id,
        title,
      },
    },
    optimisticResponse: {
      updateTimeUnit: {
        timeUnit: {
          ...timeUnit,
          title,
        },
      },
    },
  });
}

export default { commit };
