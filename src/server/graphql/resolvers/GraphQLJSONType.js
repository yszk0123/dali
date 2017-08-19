/* @flow */
import { GraphQLScalarType } from 'graphql';
import type { IResolvers } from '../interfaces';

export const GraphQLJSONType: GraphQLScalarType = (require('graphql-type-json'): GraphQLScalarType);

export default function createResolver(): IResolvers {
  return {
    JSON: GraphQLJSONType,
  };
}
