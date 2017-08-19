/* @flow */
import { resolver } from 'graphql-sequelize';
import type { IResolvers, IModels } from '../interfaces';

type Input = {
  models: IModels,
};

export default function createResolvers({
  models: { User },
}: Input): IResolvers {
  return {
    User: {
      projects: resolver(User.Projects),
    },
    Query: {
      currentUser: resolver(User),
    },
    Mutation: {
      signup: async (
        root,
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

        return user;
      },
      login: async (root, { email, password }, context) => {
        const { AuthService } = context;
        const { user } = await AuthService.login(
          { email, password, User },
          context,
        );

        // TODO: Return InvalidEmailOrPasswordError

        return user;
      },
      logout: async (root, { email, password }, { AuthService }) => {
        await AuthService.logout();
        return null;
      },
    },
  };
}
