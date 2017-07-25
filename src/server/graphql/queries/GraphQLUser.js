import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import GraphQLDate from 'graphql-date';
import { fromGlobalId } from 'graphql-relay';
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
    orderBy: new GraphQLEnumType({
      name: 'UserProjectOrderBy',
      values: {
        TITLE: { value: ['title', 'ASC'] },
        CREATED_AT: { value: ['createdAt', 'DESC'] },
        UPDATED_AT: { value: ['updatedAt', 'DESC'] },
      },
    }),
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
      if (key === 'projectId') {
        const { id: localId } = fromGlobalId(value);

        return { [key]: localId };
      }

      return { [key]: value };
    },
    orderBy: new GraphQLEnumType({
      name: 'UserTaskSetOrderBy',
      values: {
        TITLE: { value: ['title', 'ASC'] },
        PRIORITY: { value: ['priority', 'DESC'] },
        CREATED_AT: { value: ['createdAt', 'DESC'] },
        UPDATED_AT: { value: ['updatedAt', 'DESC'] },
      },
    }),
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
          projectId: {
            type: GraphQLID,
          },
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
