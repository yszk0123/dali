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
import GraphQLDate from 'graphql-date';
import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  globalIdField,
  mutationWithClientMutationId,
} from 'graphql-relay';
import { attributeFields, relay, resolver } from 'graphql-sequelize';
import { addTimeUnit, getTimeUnits, getTimeUnitById } from './database.js';
const { sequelizeNodeInterface, sequelizeConnection } = relay;

export function createSchema({ models, sequelize }) {
  const {
    DailyReport,
    DailySchedule,
    Project,
    TaskUnit,
    TimeUnit,
    User,
  } = models;

  // Node

  const { nodeInterface, nodeField, nodeTypeMapper } = sequelizeNodeInterface(
    sequelize,
  );

  // Project

  const GraphQLProject = new GraphQLObjectType({
    name: 'Project',
    fields: attributeFields(Project, {
      globalId: true,
    }),
  });

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

  // TaskUnit

  const GraphQLTaskUnit = new GraphQLObjectType({
    name: 'TaskUnit',
    fields: attributeFields(TaskUnit, {
      globalId: true,
    }),
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

  // TimeUnit

  const GraphQLTimeUnit = new GraphQLObjectType({
    name: 'TimeUnit',
    fields: attributeFields(TimeUnit, {
      globalId: true,
    }),
  });

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

  // DailyReport

  const GraphQLDailyReport = new GraphQLObjectType({
    name: 'DailyReport',
    fields: {
      ...attributeFields(DailyReport, {
        globalId: true,
      }),
    },
  });

  // DailySchedule

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

  // User

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

  nodeTypeMapper.mapTypes({
    DailyReport: GraphQLDailyReport,
    DailySchedule: GraphQLDailySchedule,
    Project: GraphQLProject,
    TaskUnit: GraphQLTaskUnit,
    TimeUnit: GraphQLTimeUnit,
    User: GraphQLUser,
  });

  // Query

  const GraphQLQuery = new GraphQLObjectType({
    name: 'Query',
    fields: {
      viewer: {
        type: GraphQLUser,
        // TODO: Implement authentication
        resolve: () => User.findOne(),
      },
      node: nodeField,
    },
  });

  // Mutations

  // const GraphQLAddTimeUnitMutation = mutationWithClientMutationId({
  //   name: 'AddTimeUnit',
  //   inputFields: {
  //     title: { type: new GraphQLNonNull(GraphQLString) },
  //   },
  //   outputFields: {
  //     timeUnitEdge: {
  //       type: GraphQLTimeUnitEdge,
  //       resolve: ({ localTimeUnitId }) => {
  //         const timeUnit = getTimeUnitById(localTimeUnitId);
  //
  //         return {
  //           cursor: cursorForObjectInConnection(getTimeUnits(), timeUnit),
  //           node: timeUnit,
  //         };
  //       },
  //     },
  //     viewer: {
  //       type: GraphQLUser,
  //       // TODO: Implement authentication
  //       resolve: () => User.findOne(),
  //     },
  //   },
  //   mutateAndGetPayload: ({ title }) => {
  //     const localTimeUnitId = addTimeUnit({ title });
  //
  //     return { localTimeUnitId };
  //   },
  // });

  function getLowerCamelCase(s) {
    return `${s[0].toLowerCase()}${s.slice(1)}`;
  }

  function createStubMutationFields(names) {
    const fields = {};

    names.forEach(name => {
      fields[getLowerCamelCase(name)] = mutationWithClientMutationId({
        name,
        inputFields: {},
        outputFields: {
          id: globalIdField(name),
        },
        mutateAndGetPayload: () => {},
      });
    });

    return fields;
  }

  const GraphQLMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...createStubMutationFields([
        'AddTaskUnit',
        'AddTimeUnit',
        'CreateDailyReport',
        'CreateDailyReportTemplate',
        'CreateProject',
        'CreateTaskUnit',
        'CreateTimeUnit',
        'RemoveDailyReport',
        'RemoveDailyReportTemplate',
        'RemoveProject',
        'RemoveTaskUnit',
        'RemoveTimeUnit',
        'UpdateDailyReport',
        'UpdateDailyReportTemplate',
        'UpdateProject',
        'UpdateTaskUnit',
        'UpdateTimeUnit',
      ]),
      // addTimeUnit: GraphQLAddTimeUnitMutation,
    },
  });

  // Schema

  return new GraphQLSchema({
    query: GraphQLQuery,
    mutation: GraphQLMutation,
  });
}
