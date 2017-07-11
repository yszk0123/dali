import { GraphQLInt, GraphQLObjectType } from 'graphql';
import { attributeFields, relay } from 'graphql-sequelize';
const { sequelizeConnection } = relay;

export default function defineGraphQLTimeUnit({
  models: { TimeUnit },
  GraphQLTaskSet,
}) {
  const GraphQLTimeUnitTaskSetConnection = sequelizeConnection({
    name: 'TimeUnitTaskSet',
    nodeType: GraphQLTaskSet,
    target: TimeUnit.TaskSets,
    connectionFields: {
      total: {
        type: GraphQLInt,
        resolve: ({ source }) => source.countTaskSets(),
      },
    },
  });

  const GraphQLTimeUnit = new GraphQLObjectType({
    name: 'TimeUnit',
    fields: {
      ...attributeFields(TimeUnit, {
        globalId: true,
      }),
      taskSets: {
        type: GraphQLTimeUnitTaskSetConnection.connectionType,
        args: GraphQLTimeUnitTaskSetConnection.connectionArgs,
        resolve: GraphQLTimeUnitTaskSetConnection.resolve,
      },
    },
  });

  return { GraphQLTimeUnit, GraphQLTimeUnitTaskSetConnection };
}
