// ref. https://github.com/mickhansen/graphql-sequelize/issues/447#issuecomment-290682481

declare module 'graphql-sequelize' {
  import * as Sequelize from 'sequelize';
  import {
    GraphQLScalarType,
    GraphQLResolveInfo,
    GraphQLInterfaceType,
    GraphQLType,
    GraphQLEnumType,
    GraphQLFieldConfig,
    GraphQLFieldConfigMap,
    GraphQLFieldResolver,
  } from 'graphql';

  type Args = { [k: string]: any };

  export type IBeforeFn<TContext> = <T>(
    options: T,
    args: Args,
    context: TContext,
    info: GraphQLResolveInfo,
  ) => T;
  export type IAfterFn<TContext> = <T>(
    result: T,
    args: Args,
    context: TContext,
    info: GraphQLResolveInfo,
  ) => T;

  interface IMapType {
    [k: string]: string;
  }

  export interface IAttributeOptions<TInstance, TAttributes> {
    exclude: Array<keyof TAttributes>; // array of model attributes to ignore - default: []
    only: Array<keyof TAttributes>; // only generate definitions for these model attributes - default: null
    globalId: boolean; // return an relay global id field - default: false
    map:
      | ((k: string) => string)
      | {
          [k: string]: string;
        }; // rename fields - default: {}
    allowNull: boolean; // disable wrapping mandatory fields in `GraphQLNonNull` - default: false
    commentToDescription: boolean; // convert model comment to GraphQL description - default: false
    cache: {}; // Cache enum types to prevent duplicate type name error - default: {}
  }

  export interface IResolverOptions<TContext> {
    list: boolean;
    handleConnection: boolean;
    before: IBeforeFn<TContext>;
    after: IAfterFn<TContext>;
  }

  export type IResolverLikeFunction<TContext> = <TInstance, TAttributes>(
    model: Sequelize.Model<TInstance, TAttributes>,
    options?: Partial<IResolverOptions<TContext>>,
  ) => any;

  // https://github.com/mickhansen/graphql-sequelize#field-helpers
  const attributeFields: <TInstance, TAttributes>(
    model: Sequelize.Model<TInstance, TAttributes>,
    options?: Partial<IAttributeOptions<TInstance, TAttributes>>,
  ) => any;
  const resolver: IResolverLikeFunction<any>;

  const defaultArgs: <TInstance, TAttributes>(
    model: Sequelize.Model<TInstance, TAttributes>,
  ) => any;
  const defaultListArgs: () => any;

  class NodeTypeMapper {
    map: any;
    mapTypes(types: any): any; // TODO: add typings
    item(type: any): any; // TODO: add typings
  }

  // see https://github.com/Microsoft/TypeScript/issues/4890
  // and https://github.com/Microsoft/TypeScript/pull/13604
  type Constructor<T> = new () => T;

  export interface ISequelizeConnectionOptions<
    TInstance,
    TAttributes,
    TContext
  > {
    name: string;
    nodeType: GraphQLType;
    target: Sequelize.Model<TInstance, TAttributes> | void; // unfortuately, associations return is defined as void in sequelize typings
    orderBy: GraphQLEnumType;
    before: IBeforeFn<TContext>;
    after: IAfterFn<TContext>;
    connectionFields: GraphQLFieldConfigMap<any, TContext>;
    edgeFields: GraphQLFieldConfigMap<any, TContext>;
    where: <V>(
      key: string,
      value: V,
      previousWhere: any,
    ) => {
      // previousWhere added in graphql-sequelize@v5.1.0
      [key: string]: V;
    };
  }

  export interface ISequelizeConnectionReturn {
    connectionType: any;
    edgeType: GraphQLType;
    nodeType: GraphQLType;
    resolveEdge: GraphQLFieldResolver<any, any>;
    connectionArgs: any;
    resolve: GraphQLFieldResolver<any, any>;
  }

  export interface RelaySequelizeNodeInterfaceConfig {
    nodeTypeMapper: NodeTypeMapper;
    nodeField: GraphQLFieldConfig<any, any>;
    nodeInterface: GraphQLInterfaceType;
  }

  const relay: {
    NodeTypeMapper: Constructor<NodeTypeMapper>;
    idFetcher: (
      sequelize: Sequelize.Sequelize,
      nodeTypeMapper: NodeTypeMapper,
    ) => any;
    typeResolver: (nodeTypeMapper: NodeTypeMapper) => any;
    isConnection: (type: any) => boolean;
    handleConnection: (values: any, args: Args) => any;
    sequelizeNodeInterface: (
      sequelize: Sequelize.Sequelize,
    ) => RelaySequelizeNodeInterfaceConfig;
    nodeType: (connectionType: any) => any;
    sequelizeConnection: <TInstance, TAttributes, TContext>(
      options: Partial<
        ISequelizeConnectionOptions<TInstance, TAttributes, TContext>
      >,
    ) => ISequelizeConnectionReturn;
  };

  const typeMapper: {
    // TODO exchange type:any with Sequelize.DataTypeAbstract?
    mapType(mapFunc: any): boolean | GraphQLType;
    toGraphQL(
      sequelizeType: any,
      sequelizeTypes: Constructor<Sequelize.Sequelize>,
    ): any;
  };

  const JSONType: {
    default: GraphQLScalarType;
  };

  const simplifyAST: (ast: any, info: any, parent: any) => any;
}
