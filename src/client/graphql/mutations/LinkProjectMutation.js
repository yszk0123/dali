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
 *     const taskSetProxy = store.get(taskSet.id);
 *
 *     taskSetProxy.setLinkedRecord(newProject, 'project');
 *   },
 */
import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();
const generateOptimisticId = makeIdGenerator('client:newLinkProject');

const mutation = graphql`
  mutation LinkProjectMutation($input: LinkProjectInput!) {
    linkProject(input: $input) {
      taskSet {
        ...TaskSetItem_taskSet
      }
    }
  }
`;

function commit(environment, { project }, taskSet) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
        projectId: project.id,
        taskSetId: taskSet.id,
      },
    },
    optimisticResponse: {
      linkProject: {
        taskSet: {
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
