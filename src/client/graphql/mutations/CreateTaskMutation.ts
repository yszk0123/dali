import { MutationOptions } from 'apollo-client';
import {
  CreateTaskMutationVariables as MutationVariables,
  CreateTaskMutation as Mutation,
  PhaseItem_phaseFragment as Fragment,
} from 'schema';
import * as fragment from '../querySchema/PhaseItem_phase.graphql';
import * as mutation from '../mutationSchema/CreateTaskMutation.graphql';

type QueryVariables = {};

export interface Options {
  phaseId: string;
}

export { mutation, MutationVariables, Mutation };

export function buildMutationOptions(
  mutationVariables: MutationVariables,
  variables: QueryVariables,
  options: Options,
): MutationOptions<Mutation> {
  const { title, description, done, phaseId, timeUnitId } = mutationVariables;

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
        done: done || false,
        phaseId,
        timeUnitId,
      },
    },
    update: (store, { data: { createTask } = { createTask: null } }) => {
      const data = store.readFragment<Fragment>({
        fragment,
        variables,
        id: options.phaseId,
      });
      if (!data || !data.tasks) {
        return;
      }

      data.tasks.push(createTask);
      store.writeFragment({
        fragment,
        data,
        variables,
        id: options.phaseId,
      });
    },
  };
}
