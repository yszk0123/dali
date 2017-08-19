import jwt from 'jsonwebtoken';
import serverConfig from '../../shared/config/serverConfig';

function decodeToken(token) {
  return jwt.verify(token, serverConfig.secret);
}

function createToken(user) {
  return user && jwt.sign({ userId: user.id }, serverConfig.secret);
}

async function authenticate({ User }, context) {
  if (!context.session || !context.session.token) {
    return;
  }
  const { userId } = decodeToken(context.session.token);

  context.user = await User.findById(userId);
}

async function signup(
  { email, password, nickname, firstName, lastName, User },
  context,
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

async function login({ email, password, User }, context) {
  const user = await User.findOne({ where: { email, password } });

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
