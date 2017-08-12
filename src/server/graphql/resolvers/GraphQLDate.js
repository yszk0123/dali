/* @flow */
import { GraphQLScalarType } from 'graphql';
import type { IResolvers } from '../interfaces';

export const GraphQLDate: GraphQLScalarType = (require('graphql-date'): GraphQLScalarType);

export default function createResolver(): IResolvers {
  return {
    Date: GraphQLDate,
  };
}
