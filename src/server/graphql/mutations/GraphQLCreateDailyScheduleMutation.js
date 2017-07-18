import { GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import GraphQLDate from 'graphql-date';

export default function defineGraphQLCreateDailyScheduleMutation({
  queries: { GraphQLDailySchedule, GraphQLUser },
  models: { DailySchedule },
}) {
  const GraphQLCreateDailyScheduleMutation = mutationWithClientMutationId({
    name: 'CreateDailySchedule',
    inputFields: {
      date: { type: new GraphQLNonNull(GraphQLDate) },
    },
    outputFields: {
      dailySchedule: {
        type: GraphQLDailySchedule,
        resolve: ({ dailySchedule }) => dailySchedule,
      },
      viewer: {
        type: GraphQLUser,
        resolve: ({ user }) => user,
      },
    },
    mutateAndGetPayload: async ({ date }, { user }) => {
      const dailySchedule = await DailySchedule.create({
        date,
      });

      await user.addDailySchedule(dailySchedule);

      return { dailySchedule, user };
    },
  });

  return {
    GraphQLCreateDailyScheduleMutation,
  };
}
