import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();
const generateOptimisticId = makeIdGenerator('client:newAddTaskUnit');

const mutation = graphql`
  mutation AddTaskUnitMutation($input: AddTaskUnitInput!) {
    addTaskUnit(input: $input) {
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

function sharedUpdater(store, timeUnit, newEdge) {
  const timeUnitProxy = store.get(timeUnit.id);
  const connection = ConnectionHandler.getConnection(
    timeUnitProxy,
    'TimeUnitItem_taskUnits',
  );

  ConnectionHandler.insertEdgeAfter(connection, newEdge);
}

function commit(environment, taskSet, timeUnit, dailySchedule) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
        dailyScheduleId: dailySchedule.id,
        taskSetId: taskSet.id,
        timeUnitId: timeUnit.id,
      },
    },
    updater: store => {
      const payload = store.getRootField('addTaskUnit');
      const newEdge = payload.getLinkedRecord('taskUnitEdge');

      sharedUpdater(store, timeUnit, newEdge);
    },
    optimisticUpdater: store => {
      const payload = store.getRootField('addTaskUnit');
      const newEdge = payload.getLinkedRecord('taskUnitEdge');

      sharedUpdater(store, timeUnit, newEdge);
    },
    optimisticResponse: {
      addTaskUnit: {
        taskUnitEdge: {
          node: {
            id: generateOptimisticId(),
            taskSet: {
              id: generateOptimisticId(),
              title: taskSet.title,
            },
          },
        },
      },
    },
  });
}

export default { commit };
