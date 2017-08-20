import * as jwt from 'jsonwebtoken';
import serverConfig from '../../shared/config/serverConfig';
import { IContext } from '../../graphql/interfaces';

function decodeToken(token: string): any {
  return jwt.verify(token, serverConfig.secret);
}

function createToken(user: any): any {
  return user && jwt.sign({ userId: user.id }, serverConfig.secret);
}

async function authenticate({ User }: any, context: IContext) {
  if (!context.session || !context.session.token) {
    return;
  }
  const { userId } = decodeToken(context.session.token) as any;

  context.user = await User.findById(userId);
}

async function signup(
  { email, password, nickname, firstName, lastName, User }: any,
  context: IContext,
) {
  const user = await User.create({
    email,
    password,
    nickname,
    firstName,
    lastName,
  });

  if (user) {
    context.session.token = createToken(user);
    context.user = user;
  }

  return { user };
}

async function login(
  { email, password, User }: any,
  context: IContext,
): Promise<any> {
  const user = await User.findOne({ where: { email, password } });

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
