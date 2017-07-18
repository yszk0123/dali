import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { attributeFields, relay, resolver } from 'graphql-sequelize';
import { first } from 'lodash';
import GraphQLDate from 'graphql-date';
import getPositionFromDaliDate from '../../../shared/utils/getPositionFromDaliDate';
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
      timeUnit: {
        type: GraphQLTimeUnit,
        args: {
          date: {
            type: new GraphQLNonNull(GraphQLDate),
          },
        },
        resolve: async (dailySchedule, { date }) => {
          const position = getPositionFromDaliDate(date);

          return first(
            await dailySchedule.getTimeUnits({
              where: { position: { $gte: position } },
              order: [['position', 'asc']],
              limit: 1,
            }),
          );
        },
      },
    },
  });

  return { GraphQLDailySchedule, GraphQLDailyScheduleTimeUnitConnection };
}
