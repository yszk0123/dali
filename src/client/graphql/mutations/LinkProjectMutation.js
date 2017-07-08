/**
 * NOTE: An alternative way
 *
 * @example
 *   const mutation = graphql`
 *     {
 *       linkProject(input: $input) {
 *         project {
 *           id
 *           title
 *         }
 *       }
 *     }
 *   `
 *
 *   updater: store => {
 *     const payload = store.getRootField('linkProject');
 *     const newProject = payload.getLinkedRecord('project');
 *     const taskUnitProxy = store.get(taskUnit.id);
 *
 *     taskUnitProxy.setLinkedRecord(newProject, 'project');
 *   },
 */
import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();
const generateOptimisticId = makeIdGenerator('client:newLinkProject');

const mutation = graphql`
  mutation LinkProjectMutation($input: LinkProjectInput!) {
    linkProject(input: $input) {
      taskUnit {
        ...TaskUnitItem_taskUnit
      }
    }
  }
`;

function commit(environment, { project }, taskUnit) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
        projectId: project.id,
        taskUnitId: taskUnit.id,
      },
    },
    optimisticResponse: {
      linkProject: {
        taskUnit: {
          edges: [
            {
              node: {
                id: generateOptimisticId(),
                title: project.title,
              },
            },
          ],
        },
      },
    },
  });
}

export default { commit };
