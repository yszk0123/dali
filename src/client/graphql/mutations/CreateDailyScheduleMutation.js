import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

// TODO: move DateUtils to src/shared/utils
import { startOfDay } from '../../../server/shared/utils/DateUtils';

const generateId = makeIdGenerator();
const generateOptimisticId = makeIdGenerator('client:newCreateDailySchedule');

const mutation = graphql.experimental`
  mutation CreateDailyScheduleMutation(
    $input: CreateDailyScheduleInput!
    $date: Date
  ) {
    createDailySchedule(input: $input) {
      viewer {
        ...DailySchedulePage_viewer @arguments(date: $date)
      }
    }
  }
`;

function commit(environment, { date: originalDate }, user) {
  const date = startOfDay(originalDate);

  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        date,
        clientMutationId: generateId(),
      },
      date,
    },
    optimisticResponse: {
      createDailySchedule: {
        viewer: {
          dailySchedule: {
            id: generateOptimisticId(),
            date,
          },
        },
      },
    },
  });
}

export default { commit };
