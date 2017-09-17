import { MutationOptions } from 'apollo-client';
import {
  AddPhaseToProjectMutationVariables as MutationVariables,
  AddPhaseToProjectMutation as Mutation,
  ProjectPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/ProjectPage.graphql';
import * as mutation from '../mutationSchema/AddPhaseToProjectMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
): MutationOptions<Mutation> {
  const { projectId, phaseId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    update: (
      store,
      { data: { addPhaseToProject: project } = { addPhaseToProject: null } },
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
