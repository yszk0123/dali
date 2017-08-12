/* @flow */
import cookieSession from 'cookie-session';
import type { IExpressMiddleware } from '../interfaces';

const cookieMiddleware = cookieSession({
  name: 'session',
  keys: ['id', 'toke'],
});

type Input = {
  User: any,
  AuthService: any,
};

export default function createAuthMiddleware({
  User,
  AuthService,
}: Input): IExpressMiddleware {
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
