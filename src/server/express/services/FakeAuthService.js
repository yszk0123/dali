// TODO: Move to __mocks__
import jwt from 'jsonwebtoken';
import serverConfig from '../../shared/config/serverConfig';

function createToken(user) {
  return user && jwt.sign({ userId: user.id }, serverConfig.secret);
}

async function authenticate({ User }, context) {
  context.user = await User.findOne();
}

async function signup({ User }, context) {
  const user = await User.findOne();

  if (user) {
    context.session.token = createToken(user);
    context.user = user;
  }

  return { user };
}

async function login({ User }, context) {
  const user = await User.findOne();

  if (user) {
    context.session.token = createToken(user);
    context.user = user;
  }

  return { user };
}

async function logout(data, context) {
  const user = null;

  context.session.token = null;

  return { user };
}

export default { authenticate, signup, login, logout };
