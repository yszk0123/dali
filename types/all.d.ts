declare module '*.graphql' {
  //import { DocumentNode } from 'graphql';

  //export default DocumentNode;
  const hoge: any;
  export = hoge;
}

declare module 'react-hot-loader' {
  export const AppContainer: any;
}

declare module 'react-dnd-html5-backend' {
  const value: any;
  export default value;
}

declare module 'react-dnd-touch-backend' {
  const value: any;
  export default value;
}

declare module 'express-history-api-fallback' {
  const value: any;
  export = value;
}

declare module 'cookie-session' {
  const value: any;
  export = value;
}

declare module 'graphql-errors' {
  export function maskErrors(schema: any): void;
}

declare module 'jsonwebtoken' {
  const value: any;
  export = value;
}

declare module 'assert-err' {
  const value: any;
  export = value;
  // export default function assertError(
  //   assertion: boolean,
  //   errorType: any,
  //   message: string,
  //   _?: any[],
  // ): void;
}

declare module 'merge-graphql-schemas' {
  export function fileLoader(path: string): any[];
  export function mergeResolvers(_: any[]): any;
  export function mergeTypes(_: any[]): any;
}

// Workaround for react-dnd
declare namespace __ReactDnd {
  const DragDropContextProvider: any;
  export { DragDropContextProvider };
}
