import { MutationOptions } from 'apollo-client';
import {
  AddTaskToProjectMutationVariables as MutationVariables,
  AddTaskToProjectMutation as Mutation,
  ProjectPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/ProjectPage.graphql';
import * as mutation from '../mutationSchema/AddTaskToProjectMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
): MutationOptions<Mutation> {
  const { projectId, taskId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    update: (
      store,
      { data: { addTaskToProject: project } = { addTaskToProject: null } },
    ) => {
      const data = store.readQuery<Query>({ query, variables });
      if (!data.projects) {
        return;
      }

      data.projects.push(project);
      store.writeQuery({ query, data, variables });
    },
  };
}
