import { GraphQLFieldResolver, GraphQLScalarType } from 'graphql';

export type ITypedef = string;

export interface IPartialSchemaDefinition {
  typeDefs: ITypedef[];
  resolvers: IResolvers;
}

export type IModels = {
  Member: any;
  Project: any;
  Task: any;
  TaskGroup: any;
  TimeUnit: any;
  User: any;
};

export type IServices = {
  AuthService: any;
};

export type ISource = {};

export type IContext = {
  AuthService: any;
  user: any;
  session?: {
    token?: string;
  };
};

type IResolverObject = {
  [key: string]: GraphQLFieldResolver<ISource, IContext>;
};
export interface IResolvers {
  [key: string]: (() => any) | IResolverObject | GraphQLScalarType;
}

// export type IResolvers = { [key: string]: any };

export type ISchema = any;
