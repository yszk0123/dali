/* @flow */

export type IExpressMiddleware = (
  request: any,
  response: any,
  next: Function,
) => void;
