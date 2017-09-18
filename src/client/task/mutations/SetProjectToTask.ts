import { MutationOptions } from 'apollo-client';
import {
  SetProjectToTaskMutationVariables as MutationVariables,
  SetProjectToTaskMutation as Mutation,
  ActionPageQuery as Query,
} from 'schema';
import * as mutation from '../mutationSchema/SetProjectToTaskMutation.graphql';

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
    // update: (
    //   store,
    //   { data: { setProjectToTask: task } = { setProjectToTask: null } },
    // ) => {
    //   const data = store.readQuery<Query>({ query, variables });
    //   if (!data.projects) {
    //     return;
    //   }

    //   data.projects.push(task);
    //   store.writeQuery({ query, data, variables });
    // },
  };
}
