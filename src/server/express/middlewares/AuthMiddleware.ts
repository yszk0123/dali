import * as cookieSession from 'cookie-session';
import { IExpressMiddleware } from '../interfaces';

const cookieMiddleware = cookieSession({
  name: 'session',
  keys: ['id', 'toke'],
});

interface Input {
  User: any;
  AuthService: any;
}

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
