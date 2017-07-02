import { GraphQLInt, GraphQLObjectType } from 'graphql';
import GraphQLDate from 'graphql-date';
import { attributeFields, relay } from 'graphql-sequelize';
import { first } from 'lodash';
import { startOfDay } from '../../shared/utils/DateUtils';
const { sequelizeConnection } = relay;

export default function defineGraphQLDailySchedule({
  DailySchedule,
  GraphQLDailySchedule,
  GraphQLProject,
  GraphQLTaskUnit,
  User,
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

  const GraphQLUserTaskUnitConnection = sequelizeConnection({
    name: 'UserTaskUnit',
    nodeType: GraphQLTaskUnit,
    target: User.TaskUnits,
    connectionFields: {
      total: {
        type: GraphQLInt,
        resolve: ({ source }) => source.countTaskUnits(),
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
      taskUnits: {
        type: GraphQLUserTaskUnitConnection.connectionType,
        args: GraphQLUserTaskUnitConnection.connectionArgs,
        resolve: GraphQLUserTaskUnitConnection.resolve,
      },
    },
    interfaces: [nodeInterface],
  });

  return {
    GraphQLUser,
    GraphQLUserProjectConnection,
    GraphQLUserTaskUnitConnection,
  };
}
