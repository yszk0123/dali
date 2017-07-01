import { GraphQLInt, GraphQLObjectType } from 'graphql';
import { attributeFields, relay } from 'graphql-sequelize';
const { sequelizeConnection } = relay;

export default function defineGraphQLTimeUnit({ TimeUnit, GraphQLTaskUnit }) {
  const GraphQLTimeUnitTaskUnitConnection = sequelizeConnection({
    name: 'TimeUnitTaskUnit',
    nodeType: GraphQLTaskUnit,
    target: TimeUnit.TaskUnits,
    connectionFields: {
      total: {
        type: GraphQLInt,
        resolve: ({ source }) => source.countTaskUnits(),
      },
    },
  });

  const GraphQLTimeUnit = new GraphQLObjectType({
    name: 'TimeUnit',
    fields: {
      ...attributeFields(TimeUnit, {
        globalId: true,
      }),
      taskUnits: {
        type: GraphQLTimeUnitTaskUnitConnection.connectionType,
        args: GraphQLTimeUnitTaskUnitConnection.connectionArgs,
        resolve: GraphQLTimeUnitTaskUnitConnection.resolve,
      },
    },
  });

  return { GraphQLTimeUnit, GraphQLTimeUnitTaskUnitConnection };
}
