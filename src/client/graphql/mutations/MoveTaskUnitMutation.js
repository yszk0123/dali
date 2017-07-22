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

function sharedUpdater(
  store,
  fromTimeUnit,
  toTimeUnit,
  deletedTaskUnitId,
  newEdge,
) {
  const fromTimeUnitProxy = store.get(fromTimeUnit.id);
  const toTimeUnitProxy = store.get(toTimeUnit.id);
  const fromConnection = ConnectionHandler.getConnection(
    fromTimeUnitProxy,
    'TimeUnitItem_taskUnits',
  );
  const toConnection = ConnectionHandler.getConnection(
    toTimeUnitProxy,
    'TimeUnitItem_taskUnits',
  );

  ConnectionHandler.deleteNode(fromConnection, deletedTaskUnitId);
  ConnectionHandler.insertEdgeAfter(toConnection, newEdge);
}

function commit(
  environment,
  taskUnit,
  fromTimeUnit,
  toTimeUnit,
  dailySchedule,
) {
  function updater(store) {
    const payload = store.getRootField('moveTaskUnit');
    const newEdge = payload.getLinkedRecord('taskUnitEdge');

    sharedUpdater(store, fromTimeUnit, toTimeUnit, taskUnit.id, newEdge);
  }

  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
        dailyScheduleId: dailySchedule.id,
        taskUnitId: taskUnit.id,
        fromTimeUnitId: fromTimeUnit.id,
        toTimeUnitId: toTimeUnit.id,
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
