import cookieSession from 'cookie-session';

const cookieMiddleware = cookieSession({
  name: 'session',
  keys: ['id', 'toke'],
});

export default function createAuthMiddleware({ User, AuthService }) {
  return (req, res, next) => {
    cookieMiddleware(req, res, async () => {
      await AuthService.authenticate({ User }, req);

      next();
    });
  };
}
