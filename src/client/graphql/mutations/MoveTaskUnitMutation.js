import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();
const generateOptimisticId = makeIdGenerator('client:newMoveTaskUnit');

const mutation = graphql`
  mutation MoveTaskUnitMutation($input: MoveTaskUnitInput!) {
    moveTaskUnit(input: $input) {
      taskUnitEdge {
        node {
          id
          taskSet {
            id
            title
          }
        }
      }
    }
  }
`;

function sharedUpdater(store, timeUnit, deletedTaskUnitId, newEdge) {
  const timeUnitProxy = store.get(timeUnit.id);
  const connection = ConnectionHandler.getConnection(
    timeUnitProxy,
    'TimeUnitItem_taskUnits',
  );

  ConnectionHandler.deleteNode(connection, deletedTaskUnitId);
  ConnectionHandler.insertEdgeAfter(connection, newEdge);
}

function commit(environment, taskUnit, timeUnit, dailySchedule) {
  function updater(store) {
    const payload = store.getRootField('moveTaskUnit');
    const newEdge = payload.getLinkedRecord('taskUnitEdge');

    sharedUpdater(store, timeUnit, timeUnit.id, newEdge);
  }

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
    updater,
    optimisticUpdater: updater,
    optimisticResponse: {
      moveTaskUnit: {
        taskUnitEdge: {
          node: {
            id: generateOptimisticId(),
            taskSet: taskUnit.taskSet,
          },
        },
      },
    },
  });
}

export default { commit };
