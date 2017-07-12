import { GraphQLObjectType } from 'graphql';
import { attributeFields, resolver } from 'graphql-sequelize';

export default function defineGraphQLTaskUnit({
  GraphQLTaskSet,
  models: { TaskUnit },
}) {
  const GraphQLTaskUnit = new GraphQLObjectType({
    name: 'TaskUnit',
    fields: {
      ...attributeFields(TaskUnit, {
        globalId: true,
      }),
      taskSet: {
        type: GraphQLTaskSet,
        resolve: resolver(TaskUnit.TaskSet),
      },
    },
  });

  return { GraphQLTaskUnit };
}
