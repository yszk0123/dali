import { GraphQLScalarType, GraphQLError, Kind } from 'graphql';
import * as assertError from 'assert-err';
import { IResolvers } from '../interfaces';

const DATEONLY_PATTERN = /^[1-9]\d{0,3}-[01]\d-\d{2}$/;

const GraphQLDateOnly = new GraphQLScalarType({
  name: 'DateOnly',
  serialize: function(value: any) {
    assertError(
      DATEONLY_PATTERN.test(value),
      TypeError,
      `Field error: value ${value} is an invalid Date`,
    );
    return value;
  },
  parseValue: function(value: any): Date {
    assertError(
      DATEONLY_PATTERN.test(value),
      TypeError,
      `Field error: value ${value} is an invalid Date`,
    );
    return value;
  },
  parseLiteral: function(ast: any) {
    assertError(
      ast.kind === Kind.STRING,
      GraphQLError,
      'Query error: Can only parse strings to dates but got a: ' + ast.kind,
      [ast],
    );

    assertError(
      DATEONLY_PATTERN.test(ast.value),
      GraphQLError,
      'Query error: Invalid date format, only accepts: YYYY-MM-DD',
      [ast],
    );

    return ast.value;
  },
});

export default function createResolver(): IResolvers {
  return {
    DateOnly: GraphQLDateOnly,
  };
}
