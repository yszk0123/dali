import { GraphQLInt, GraphQLObjectType } from 'graphql';
import { attributeFields, relay, resolver } from 'graphql-sequelize';
import { first } from 'lodash';
import { startOfDay } from 'date-fns';
const { sequelizeConnection } = relay;

const THIRTY_MINUTES_IN_MILLISECONDS = 30 * 60 * 1000;

function getPositionFromDate(date) {
  const dt = date - startOfDay(date);

  return Math.floor(dt / THIRTY_MINUTES_IN_MILLISECONDS);
}

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
          position: {
            type: GraphQLInt,
          },
        },
        resolve: async (
          dailySchedule,
          { position = getPositionFromDate(new Date()) },
        ) => {
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
