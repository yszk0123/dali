import { GraphQLObjectType } from 'graphql';
import { attributeFields, resolver } from 'graphql-sequelize';

export default function defineGraphQLTaskUnit({
  GraphQLProject,
  models: { TaskUnit },
}) {
  const GraphQLTaskUnit = new GraphQLObjectType({
    name: 'TaskUnit',
    fields: {
      ...attributeFields(TaskUnit, {
        globalId: true,
      }),
      project: {
        type: GraphQLProject,
        resolve: resolver(TaskUnit.Project),
      },
    },
  });

  return { GraphQLTaskUnit };
}
