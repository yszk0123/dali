import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

export default function defineGraphQLLoginMutation({
  queries: { GraphQLUser },
  models: { User },
}) {
  const GraphQLLoginMutation = mutationWithClientMutationId({
    name: 'Login',
    inputFields: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    outputFields: {
      viewer: {
        type: GraphQLUser,
        resolve: ({ user }) => user,
      },
    },
    mutateAndGetPayload: async ({ email, password }, context) => {
      const { AuthService } = context;
      const { user } = await AuthService.login(
        { email, password, User },
        context,
      );

      // TODO: Return InvalidEmailOrPasswordError

      return { user };
    },
  });

  return {
    GraphQLLoginMutation,
  };
}
