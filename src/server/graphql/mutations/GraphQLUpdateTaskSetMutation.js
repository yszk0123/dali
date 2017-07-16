import {
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
  GraphQLID,
} from 'graphql';
import { fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
import { first, omitBy, isUndefined } from 'lodash';

export default function defineGraphQLUpdateTaskSetMutation({
  queries: { GraphQLTaskSet, GraphQLUser },
  models: { TaskSet },
}) {
  const GraphQLUpdateTaskSetMutation = mutationWithClientMutationId({
    name: 'UpdateTaskSet',
    inputFields: {
      done: { type: GraphQLBoolean },
      taskSetId: { type: new GraphQLNonNull(GraphQLID) },
      title: { type: GraphQLString },
    },
    outputFields: {
      taskSet: {
        type: GraphQLTaskSet,
        resolve: ({ taskSet }) => taskSet,
      },
      viewer: {
        type: GraphQLUser,
        resolve: ({ user }) => user,
      },
    },
    mutateAndGetPayload: async (
      { taskSetId: globalTaskSetId, title, done },
      { user },
    ) => {
      const { id: localTaskSetId } = fromGlobalId(globalTaskSetId);
      const taskSet = first(
        await user.getTaskSets({
          where: { id: localTaskSetId },
          rejectOnEmpty: true,
        }),
      );

      await taskSet.update(omitBy({ title, done }, isUndefined));

      return { taskSet, user };
    },
  });

  return {
    GraphQLUpdateTaskSetMutation,
  };
}
