import { defaults } from 'lodash';
import { MutationOptions } from 'apollo-client';
import {
  UpdateGroupMutationVariables as MutationVariables,
  UpdateGroupMutation as Mutation,
  // GroupItem_groupFragment,
} from 'schema';
import * as mutation from '../mutationSchema/UpdateGroupMutation.graphql';

type QueryVariables = {};

export { mutation, MutationVariables, Mutation };

export function build(
  mutationVariables: MutationVariables,
  variables: QueryVariables = {},
  // group: GroupItem_groupFragment,
): MutationOptions<Mutation> {
  const { title, groupId } = mutationVariables;

  return {
    mutation,
    variables: mutationVariables,
    // optimisticResponse: {
    //   __typename: 'Mutation',
    //   updateGroup: {
    //     __typename: 'Group',
    //     ...defaults({ title, groupId }, group),
    //   },
    // },
  };
}
