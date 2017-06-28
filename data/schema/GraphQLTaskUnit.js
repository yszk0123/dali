/* eslint-disable no-unused-vars */
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { attributeFields, relay, resolver } from 'graphql-sequelize';
const { sequelizeNodeInterface, sequelizeConnection } = relay;

export default function defineGraphQLTaskUnit({ TaskUnit }) {
  const GraphQLTaskUnit = new GraphQLObjectType({
    name: 'TaskUnit',
    fields: attributeFields(TaskUnit, {
      globalId: true,
    }),
  });

  return { GraphQLTaskUnit };
}
