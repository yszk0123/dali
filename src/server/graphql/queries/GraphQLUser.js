import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLObjectType,
} from 'graphql';
import GraphQLDate from 'graphql-date';
import { attributeFields, relay } from 'graphql-sequelize';
import { first } from 'lodash';
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
            type: new GraphQLNonNull(GraphQLDate),
          },
        },
        resolve: async (user, { date }) => {
          return first(
            await user.getDailySchedules({
              where: { date },
            }),
          );
        },
      },
      taskSets: {
        type: GraphQLUserTaskSetConnection.connectionType,
        args: {
          ...GraphQLUserTaskSetConnection.connectionArgs,
          done: {
            type: GraphQLBoolean,
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
