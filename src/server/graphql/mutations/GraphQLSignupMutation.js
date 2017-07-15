import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

export default function defineGraphQLSignupMutation({
  queries: { GraphQLUser },
  models: { User },
}) {
  const GraphQLSignupMutation = mutationWithClientMutationId({
    name: 'Signup',
    inputFields: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      nickname: { type: new GraphQLNonNull(GraphQLString) },
      firstName: { type: new GraphQLNonNull(GraphQLString) },
      lastName: { type: new GraphQLNonNull(GraphQLString) },
    },
    outputFields: {
      viewer: {
        type: GraphQLUser,
        resolve: ({ user }) => user,
      },
    },
    mutateAndGetPayload: async (
      { email, password, nickname, firstName, lastName },
      context,
    ) => {
      const { AuthService } = context;
      const { user } = await AuthService.signup(
        {
          email,
          password,
          nickname,
          firstName,
          lastName,
          User,
        },
        context,
      );

      return { user };
    },
  });

  return {
    GraphQLSignupMutation,
  };
}
