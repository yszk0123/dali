import { GraphQLInt, GraphQLObjectType } from 'graphql';
import GraphQLDate from 'graphql-date';
import { attributeFields, relay, resolver } from 'graphql-sequelize';
import { startOfDay } from '../../shared/utils/DateUtils';
const { sequelizeConnection } = relay;

export default function defineGraphQLUser({
  GraphQLDailyReport,
  GraphQLProject,
  GraphQLTaskUnit,
  GraphQLTimeUnit,
  models: { User, DailyReport },
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

  const GraphQLUserTimeUnitConnection = sequelizeConnection({
    name: 'UserTimeUnit',
    nodeType: GraphQLTimeUnit,
    target: User.TimeUnits,
    where: (key, value) => {
      if (key === 'scheduleDate' && !value) {
        return { scheduleDate: startOfDay(new Date()) };
      }

      return { [key]: value };
    },
    connectionFields: {
      total: {
        type: GraphQLInt,
        resolve: ({ source }) => source.countTimeUnits(),
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
      taskUnits: {
        type: GraphQLUserTaskUnitConnection.connectionType,
        args: GraphQLUserTaskUnitConnection.connectionArgs,
        resolve: GraphQLUserTaskUnitConnection.resolve,
      },
      timeUnits: {
        type: GraphQLUserTimeUnitConnection.connectionType,
        args: {
          ...GraphQLUserTimeUnitConnection.connectionArgs,
          scheduleDate: {
            type: GraphQLDate,
          },
        },
        resolve: GraphQLUserTimeUnitConnection.resolve,
      },
      dailyReport: {
        type: GraphQLDailyReport,
        resolve: resolver(DailyReport),
      },
    },
    interfaces: [nodeInterface],
  });

  return {
    GraphQLUser,
    GraphQLUserProjectConnection,
    GraphQLUserTaskUnitConnection,
    GraphQLUserTimeUnitConnection,
  };
}
