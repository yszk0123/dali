/**
 * ref. https://github.com/mickhansen/graphql-sequelize/issues/415#issuecomment-278885839
 * @flow
 */
import { GraphQLInt, GraphQLString, GraphQLScalarType } from 'graphql';
import type { IResolvers } from '../interfaces';
import { GraphQLJSONType } from './GraphQLJSONType';
// import { ITypedef, IResolvers } from 'graphql-tools/dist/Interfaces';

export const GraphQLListWhereType = new GraphQLScalarType({
  // NOTE: This is an object containing the whole configuration of a scalar in a private property, so let's hope it
  // won't change over time
  ...(GraphQLJSONType: any)['_scalarConfig'],
  name: 'ListWhere',
  description:
    'A JSON object conforming to the shape specified in http://docs.sequelizejs.com/en/latest/docs/querying/',
});

export const GraphQLListLimitType = new GraphQLScalarType({
  // NOTE: This is an object containing the whole configuration of a scalar in a private property, so let's hope it
  // won't change over time
  ...(GraphQLInt: any)['_scalarConfig'],
  name: 'ListLimit',
  description: 'An Int representing how many items to fetch in a List',
});

export const GraphQLListOffsetType = new GraphQLScalarType({
  // NOTE: This is an object containing the whole configuration of a scalar in a private property, so let's hope it
  // won't change over time
  ...(GraphQLInt: any)['_scalarConfig'],
  name: 'ListOffset',
  description:
    'An Int representing from which item index to start fetching a List',
});

export const GraphQLListOrderType = new GraphQLScalarType({
  // NOTE: This is an object containing the whole configuration of a scalar in a private property, so let's hope it
  // won't change over time
  ...(GraphQLString: any)['_scalarConfig'],
  name: 'ListOrder',
  description:
    'A String representing desired order based on a field supports formats like: "name", "reverse:name"',
});

export default function createResolver(): IResolvers {
  return {
    ListWhere: GraphQLListWhereType,
    ListLimit: GraphQLListLimitType,
    ListOffset: GraphQLListOffsetType,
    ListOrder: GraphQLListOrderType,
  };
}
