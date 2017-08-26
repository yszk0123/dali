export interface IExpressMiddleware {
  (request: any, response: any, next: Function): void;
}
