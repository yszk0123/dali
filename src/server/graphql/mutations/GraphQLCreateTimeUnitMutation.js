import { GraphQLNonNull, GraphQLInt } from 'graphql';
import GraphQLDate from 'graphql-date';
import { mutationWithClientMutationId } from 'graphql-relay';
import { startOfDay } from '../../shared/utils/DateUtils';

export default function defineGraphQLCreateTimeUnitMutation({
  queries: { GraphQLTimeUnitEdge, GraphQLUser, GraphQLUserTimeUnitConnection },
  models: { TimeUnit },
}) {
  const GraphQLCreateTimeUnitMutation = mutationWithClientMutationId({
    name: 'CreateTimeUnit',
    inputFields: {
      scheduleDate: { type: GraphQLDate },
      position: { type: new GraphQLNonNull(GraphQLInt) },
    },
    outputFields: {
      timeUnitEdge: {
        type: GraphQLUserTimeUnitConnection.edgeType,
        resolve: ({ timeUnit }) => {
          return GraphQLUserTimeUnitConnection.resolveEdge(timeUnit);
        },
      },
      viewer: {
        type: GraphQLUser,
        resolve: ({ user }) => user,
      },
    },
    mutateAndGetPayload: async (
      { scheduleDate = startOfDay(new Date()), position },
      { user },
    ) => {
      const timeUnit = await TimeUnit.create({ scheduleDate, position });
      await user.addTimeUnit(timeUnit);

      return { timeUnit, user };
    },
  });

  return {
    GraphQLCreateTimeUnitMutation,
  };
}
