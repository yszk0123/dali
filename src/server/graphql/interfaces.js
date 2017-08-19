/* @flow */

export type ITypedef = string;

export type IResolvers = { [key: string]: any };

export interface IPartialSchemaDefinition {
  typeDefs: ITypedef[],
  resolvers: IResolvers,
}

export type IModels = {|
  Member: any,
  Project: any,
  Task: any,
  TaskGroup: any,
  TimeUnit: any,
  User: any,
|};

export type IServices = {|
  AuthService: any,
|};

export type ISchema = any;
