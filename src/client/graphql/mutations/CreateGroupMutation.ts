import { MutationOptions } from 'apollo-client';
import {
  CreateGroupMutationVariables as MutationVariables,
  CreateGroupMutation as Mutation,
  GroupPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/GroupPage.graphql';
import * as mutation from '../mutationSchema/CreateGroupMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
): MutationOptions<Mutation> {
  const { title } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      createGroup: {
        __typename: 'Group',
        id: null,
        title,
      },
    },
    update: (
      store,
      { data: { createGroup: group } = { createGroup: null } },
    ) => {
      const data = store.readQuery<Query>({ query, variables });
      if (!data.groups) {
        return;
      }

      data.groups.push(group);
      store.writeQuery({ query, data, variables });
    },
  };
}
