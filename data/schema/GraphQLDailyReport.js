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

export default function defineGraphQLDailyReport({ DailyReport }) {
  const GraphQLDailyReport = new GraphQLObjectType({
    name: 'DailyReport',
    fields: {
      ...attributeFields(DailyReport, {
        globalId: true,
      }),
    },
  });

  return { GraphQLDailyReport };
}
