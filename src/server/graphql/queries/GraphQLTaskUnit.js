import { GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

export default function defineGraphQLTaskUnit({ models: { TaskUnit } }) {
  const GraphQLTaskUnit = new GraphQLObjectType({
    name: 'TaskUnit',
    fields: attributeFields(TaskUnit, {
      globalId: true,
    }),
  });

  return { GraphQLTaskUnit };
}
