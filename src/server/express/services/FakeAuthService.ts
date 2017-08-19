// TODO: Move to __mocks__
import * as jwt from 'jsonwebtoken';
import serverConfig from '../../shared/config/serverConfig';
import { IContext } from '../../graphql/interfaces';

function createToken(user: any): any {
  return user && jwt.sign({ userId: user.id }, serverConfig.secret);
}

async function authenticate({ User }: any, context: IContext) {
  context.user = await User.findOne();
}

async function signup({ User }: any, context: IContext) {
  const user = await User.findOne();

  if (user) {
    context.session.token = createToken(user);
    context.user = user;
  }

  return { user };
}

async function login({ User }: any, context: IContext): Promise<any> {
  const user = await User.findOne();

  if (user) {
    context.session.token = createToken(user);
    context.user = user;
  }

  return { user };
}

async function logout(data: any, context: IContext): Promise<any> {
  const user: any = null;

  context.session.token = null;

  return { user };
}

export default { authenticate, signup, login, logout };
