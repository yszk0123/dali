import { GraphQLInt, GraphQLObjectType } from 'graphql';
import { attributeFields, relay } from 'graphql-sequelize';
const { sequelizeConnection } = relay;

export default function defineGraphQLTimeUnit({
  models: { TimeUnit },
  GraphQLTaskUnit,
}) {
  const GraphQLTimeUnitTaskUnitConnection = sequelizeConnection({
    name: 'TimeUnitTaskUnit',
    nodeType: GraphQLTaskUnit,
    target: TimeUnit.TaskUnits,
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
