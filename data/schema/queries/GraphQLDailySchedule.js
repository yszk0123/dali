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

export default function defineGraphQLDailySchedule({
  DailySchedule,
  GraphQLDailyReport,
  GraphQLTimeUnit,
  DailyReport,
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
