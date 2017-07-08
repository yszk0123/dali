import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();
const generateOptimisticId = makeIdGenerator('client:newLinkTaskUnit');

const mutation = graphql`
  mutation LinkTaskUnitMutation($input: LinkTaskUnitInput!) {
    linkTaskUnit(input: $input) {
      taskUnitEdge {
        node {
          id
          title
        }
      }
    }
  }
`;

function sharedUpdater(store, timeUnit, newEdge) {
  const timeUnitProxy = store.get(timeUnit.id);
  const connection = ConnectionHandler.getConnection(
    timeUnitProxy,
    'TimeUnitItem_taskUnits',
  );

  ConnectionHandler.insertEdgeAfter(connection, newEdge);
}

function commit(environment, taskUnit, timeUnit, dailySchedule) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
        dailyScheduleId: dailySchedule.id,
        taskUnitId: taskUnit.id,
        timeUnitId: timeUnit.id,
      },
    },
    updater: store => {
      const payload = store.getRootField('linkTaskUnit');
      const newEdge = payload.getLinkedRecord('taskUnitEdge');

      sharedUpdater(store, timeUnit, newEdge);
    },
    optimisticUpdater: store => {
      const payload = store.getRootField('linkTaskUnit');
      const newEdge = payload.getLinkedRecord('taskUnitEdge');

      sharedUpdater(store, timeUnit, newEdge);
    },
    optimisticResponse: {
      linkTaskUnit: {
        taskUnitEdge: {
          node: {
            id: generateOptimisticId(),
            title: taskUnit.title,
          },
        },
      },
    },
  });
}

export default { commit };
