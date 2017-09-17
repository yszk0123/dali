import { MutationOptions } from 'apollo-client';
import {
  CreatePhaseMutationVariables as MutationVariables,
  CreatePhaseMutation as Mutation,
  PhasePageQueryVariables as QueryVariables,
  PhasePageQuery as Query,
} from 'schema';
import * as query from '../querySchema/PhasePage.graphql';
import * as mutation from '../mutationSchema/CreatePhaseMutation.graphql';

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
): MutationOptions<Mutation> {
  const {
    title,
    description,
    done = false,
    projectId = null,
  } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      createPhase: {
        __typename: 'Phase',
        id: null,
        title,
        description,
        done,
        projectId,
        project: null,
        tasks: [],
      },
    },
    update: (
      store,
      { data: { createPhase: phase } = { createPhase: null } },
    ) => {
      const data = store.readQuery<Query>({ query, variables });
      if (!data.phases) {
        return;
      }

      data.phases.push(phase);
      store.writeQuery({ query, data, variables });
    },
  };
}
