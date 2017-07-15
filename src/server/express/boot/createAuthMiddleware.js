import cookieSession from 'cookie-session';

const cookieMiddleware = cookieSession({
  name: 'session',
  keys: ['id', 'toke'],
});

export default function createAuthMiddleware({ User, AuthService }) {
  return (req, res, next) => {
    req.AuthService = AuthService;

    cookieMiddleware(req, res, async () => {
      try {
        await AuthService.authenticate({ User }, req);
        next();
      } catch (error) {
        next(error);
      }
    });
  };
}
