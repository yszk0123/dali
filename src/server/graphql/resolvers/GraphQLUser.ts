import { IModels, IResolvers } from '../interfaces';
import resolver from '../utils/resolver';

interface Input {
  models: IModels;
}

export default function createResolvers({
  models: { User },
}: Input): IResolvers {
  return {
    User: {
      projects: resolver(User.Projects),
    },
    Query: {
      currentUser: (root, args, { user }) => user,
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
      login: async (
        root,
        { email, password },
        context,
      ): Promise<typeof User> => {
        const { AuthService } = context;
        const { user } = await AuthService.login(
          { email, password, User },
          context,
        );

        // TODO: Return InvalidEmailOrPasswordError

        return user;
      },
      logout: async (
        root,
        { email, password },
        { AuthService },
      ): Promise<any> => {
        await AuthService.logout();
        return null;
      },
    },
  };
}
