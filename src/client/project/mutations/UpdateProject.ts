import { defaults } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  UpdateProjectMutationVariables as MutationVariables,
  UpdateProjectMutation as Mutation,
  ProjectItem_projectFragment,
} from 'schema';
import * as mutation from '../mutationSchema/UpdateProjectMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  project: ProjectItem_projectFragment,
): MutationOptions<Mutation> {
  const { title, groupId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      updateProject: {
        __typename: 'Project',
        ...defaults({ title, groupId }, project),
      },
    },
  };
}
