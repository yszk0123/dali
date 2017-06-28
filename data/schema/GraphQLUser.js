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
          id: {
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        resolve: resolver(DailySchedule),
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
