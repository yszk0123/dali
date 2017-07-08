import { GraphQLInt, GraphQLObjectType } from 'graphql';
import { attributeFields, relay, resolver } from 'graphql-sequelize';
const { sequelizeConnection } = relay;

export default function defineGraphQLDailySchedule({
  GraphQLDailyReport,
  GraphQLTimeUnit,
  models: { DailySchedule, DailyReport },
}) {
  const GraphQLDailyScheduleTimeUnitConnection = sequelizeConnection({
    name: 'DailyScheduleTimeUnit',
    nodeType: GraphQLTimeUnit,
    target: DailySchedule.TimeUnits,
    connectionFields: {
      total: {
        type: GraphQLInt,
        resolve: ({ source }) => source.countTimeUnits(),
      },
    },
  });

  const GraphQLDailySchedule = new GraphQLObjectType({
    name: 'DailySchedule',
    fields: {
      ...attributeFields(DailySchedule, {
        globalId: true,
      }),
      dailyReport: {
        type: GraphQLDailyReport,
        resolve: resolver(DailyReport),
      },
      timeUnits: {
        type: GraphQLDailyScheduleTimeUnitConnection.connectionType,
        args: GraphQLDailyScheduleTimeUnitConnection.connectionArgs,
        resolve: GraphQLDailyScheduleTimeUnitConnection.resolve,
      },
    },
  });

  return { GraphQLDailySchedule, GraphQLDailyScheduleTimeUnitConnection };
}
