import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();
const generateOptimisticId = makeIdGenerator('client:newTimeUnit');

const mutation = graphql`
  mutation CreateTimeUnitMutation($input: CreateTimeUnitInput!) {
    createTimeUnit(input: $input) {
      timeUnitEdge {
        node {
          ...TimeUnitItem_timeUnit
        }
      }
    }
  }
`;

function sharedUpdater(store, dailySchedule, newEdge) {
  const userProxy = store.get(dailySchedule.id);
  const connection = ConnectionHandler.getConnection(
    userProxy,
    'TimeUnitList_timeUnits',
  );

  ConnectionHandler.insertEdgeAfter(connection, newEdge);
}

function commit(environment, { position }, dailySchedule) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
        dailyScheduleId: dailySchedule.id,
        position,
      },
    },
    updater: store => {
      const payload = store.getRootField('createTimeUnit');
      const newEdge = payload.getLinkedRecord('timeUnitEdge');

      sharedUpdater(store, dailySchedule, newEdge);
    },
    optimisticUpdater: store => {
      const payload = store.getRootField('createTimeUnit');
      const newEdge = payload.getLinkedRecord('timeUnitEdge');

      sharedUpdater(store, dailySchedule, newEdge);
    },
    optimisticResponse: {
      createTimeUnit: {
        timeUnitEdge: {
          node: {
            id: generateOptimisticId(),
            position,
            taskUnits: {
              edges: [],
            },
          },
        },
      },
    },
  });
}

export default { commit };
