import { commitMutation, graphql } from 'react-relay';
import makeIdGenerator from '../../shared/utils/makeIdGenerator';

const generateId = makeIdGenerator();

const mutation = graphql`
  mutation UpdateProjectMutation($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      project {
        ...UpdateProjectTitleModal_project
      }
    }
  }
`;

function commit(environment, { title }, project) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: generateId(),
        projectId: project.id,
        title,
      },
    },
    optimisticResponse: {
      updateProject: {
        project: {
          ...project,
          title,
        },
      },
    },
  });
}

export default { commit };
