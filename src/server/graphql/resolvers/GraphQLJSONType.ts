import { GraphQLScalarType } from 'graphql';
import { IResolvers } from '../interfaces';

export const GraphQLJSONType: GraphQLScalarType = require('graphql-type-json') as GraphQLScalarType;

export default function createResolver(): IResolvers {
  return {
    JSON: GraphQLJSONType,
  };
}
