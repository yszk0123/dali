import { mutationWithClientMutationId } from 'graphql-relay';

export default function defineGraphQLLogoutMutation({
  queries: { GraphQLUser },
  models: { User },
}) {
  const GraphQLLogoutMutation = mutationWithClientMutationId({
    name: 'Logout',
    inputFields: {},
    outputFields: {
      viewer: {
        type: GraphQLUser,
        resolve: () => null,
      },
    },
    mutateAndGetPayload: async ({ email, password }, { AuthService }) => {
      await AuthService.logout();

      return {};
    },
  });

  return {
    GraphQLLogoutMutation,
  };
}
