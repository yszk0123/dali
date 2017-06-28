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

export default function defineGraphQLProject({ Project }) {
  const GraphQLProject = new GraphQLObjectType({
    name: 'Project',
    fields: attributeFields(Project, {
      globalId: true,
    }),
  });

  return { GraphQLProject };
}
