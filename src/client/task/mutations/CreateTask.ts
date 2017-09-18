import { MutationOptions } from 'apollo-client';
import {
  CreateTaskMutationVariables as MutationVariables,
  CreateTaskMutation as Mutation,
  TaskPageQueryVariables as QueryVariables,
  TaskPageQuery as Query,
} from 'schema';
import * as query from '../querySchema/TaskPage.graphql';
import * as mutation from '../mutationSchema/CreateTaskMutation.graphql';

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
      createTask: {
        __typename: 'Task',
        id: null,
        title,
        description,
        done,
        projectId,
        project: null,
        actions: [],
      },
    },
    update: (
      store,
      { data: { createTask: task } = { createTask: null } },
    ) => {
      const data = store.readQuery<Query>({ query, variables });
      if (!data.tasks) {
        return;
      }

      data.tasks.push(task);
      store.writeQuery({ query, data, variables });
    },
  };
}
