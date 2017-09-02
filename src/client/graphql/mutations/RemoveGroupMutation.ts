import { MutationOptions } from 'apollo-client';
import {
  RemoveGroupMutationVariables as MutationVariables,
  RemoveGroupMutation as Mutation,
  GroupPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/GroupPage.graphql';
import * as mutation from '../mutationSchema/RemoveGroupMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
): MutationOptions<Mutation> {
  const { groupId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    optimisticResponse: {
      __typename: 'Mutation',
      removeGroup: {
        __typename: 'RemoveGroupPayload',
        removedGroupId: groupId,
      },
    },
    update: (store, { data: { removeGroup } = { removeGroup: null } }) => {
      const data = store.readQuery<Query>({ query, variables });
      if (!removeGroup || !data.groups) {
        return;
      }

      data.groups = data.groups.filter(
        (p: any) => p.id !== removeGroup.removedGroupId,
      );
      store.writeQuery({ query, data, variables });
    },
  };
}
