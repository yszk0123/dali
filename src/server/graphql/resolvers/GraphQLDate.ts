import { GraphQLScalarType } from 'graphql';
import { IResolvers } from '../interfaces';

export const GraphQLDate: GraphQLScalarType = require('graphql-date') as GraphQLScalarType;

export default function createResolver(): IResolvers {
  return {
    Date: GraphQLDate,
  };
}
