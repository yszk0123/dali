import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();
const generateOptimisticId = makeIdGenerator('client:newLinkProject');

const mutation = graphql`
  mutation LinkProjectMutation($input: LinkProjectInput!) {
    linkProject(input: $input) {
      project {
        id
        title
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
        project: {
          id: generateOptimisticId(),
          title: project.title,
        },
      },
    },
  });
}

export default { commit };
