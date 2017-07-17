import { GraphQLObjectType } from 'graphql';
import { attributeFields, resolver } from 'graphql-sequelize';

export default function defineGraphQLTaskSet({
  GraphQLProject,
  models: { TaskSet },
}) {
  const GraphQLTaskSet = new GraphQLObjectType({
    name: 'TaskSet',
    fields: {
      ...attributeFields(TaskSet, {
        globalId: true,
      }),
      project: {
        type: GraphQLProject,
        resolve: resolver(TaskSet.Project),
      },
    },
  });

  return { GraphQLTaskSet };
}
