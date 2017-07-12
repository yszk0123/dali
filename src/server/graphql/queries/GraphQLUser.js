import { GraphQLInt, GraphQLEnumType, GraphQLObjectType } from 'graphql';
import GraphQLDate from 'graphql-date';
import { attributeFields, relay } from 'graphql-sequelize';
import { first } from 'lodash';
import { startOfDay } from '../../shared/utils/DateUtils';
const { sequelizeConnection } = relay;

export default function defineGraphQLDailySchedule({
  GraphQLDailySchedule,
  GraphQLProject,
  GraphQLTaskSet,
  models: { DailySchedule, User },
  nodeInterface,
}) {
  const GraphQLUserProjectConnection = sequelizeConnection({
    name: 'UserProject',
    nodeType: GraphQLProject,
    target: User.Projects,
    connectionFields: {
      total: {
        type: GraphQLInt,
        resolve: ({ source }) => source.countProjects(),
      },
    },
  });

  const GraphQLUserTaskSetConnection = sequelizeConnection({
    name: 'UserTaskSet',
    nodeType: GraphQLTaskSet,
    target: User.TaskSets,
    where: (key, value) => {
      if (key === 'status') {
        return {};
      }
      return { [key]: value };
    },
    before: (options, { status, date = startOfDay(new Date()) }) => {
      if (status === 'TODO') {
        options.where = {
          ...options.where,
          startAt: {
            $lte: date,
          },
          endAt: {
            $gt: date,
          },
        };
      }

      if (status === 'DONE') {
        options.where = {
          ...options.where,
          endAt: {
            $lte: date,
          },
        };
      }

      return options;
    },
    connectionFields: {
      total: {
        type: GraphQLInt,
        resolve: ({ source }) => source.countTaskSets(),
      },
    },
  });

  const GraphQLUser = new GraphQLObjectType({
    name: 'User',
    fields: {
      ...attributeFields(User, {
        globalId: true,
      }),
      projects: {
        type: GraphQLUserProjectConnection.connectionType,
        args: GraphQLUserProjectConnection.connectionArgs,
        resolve: GraphQLUserProjectConnection.resolve,
      },
      dailySchedule: {
        type: GraphQLDailySchedule,
        args: {
          date: {
            type: GraphQLDate,
          },
        },
        resolve: async (user, args) => {
          const date = args.date || new Date();

          const schedules = await user.getDailySchedules({
            where: {
              date: startOfDay(date),
            },
          });

          return first(schedules);
        },
      },
      taskSets: {
        type: GraphQLUserTaskSetConnection.connectionType,
        args: {
          ...GraphQLUserTaskSetConnection.connectionArgs,
          startAt: {
            type: GraphQLDate,
          },
          endAt: {
            type: GraphQLDate,
          },
          status: {
            type: new GraphQLEnumType({
              name: 'UserTaskSetStatus',
              values: {
                TODO: { value: 'TODO' },
                DONE: { value: 'DONE' },
              },
            }),
            defaultValue: 'TODO',
          },
        },
        resolve: GraphQLUserTaskSetConnection.resolve,
      },
    },
    interfaces: [nodeInterface],
  });

  return {
    GraphQLUser,
    GraphQLUserProjectConnection,
    GraphQLUserTaskSetConnection,
  };
}
