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
import defineGraphQLProject from '../schema/GraphQLProject';
import defineGraphQLTaskUnit from '../schema/GraphQLTaskUnit';
import defineGraphQLTimeUnit from '../schema/GraphQLTimeUnit';
import defineGraphQLDailyReport from '../schema/GraphQLDailyReport';
import defineGraphQLDailySchedule from '../schema/GraphQLDailySchedule';
import defineGraphQLUser from '../schema/GraphQLUser';
const { sequelizeNodeInterface, sequelizeConnection } = relay;

export default function defineSchema({ models, sequelize }) {
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

  // Query

  const { GraphQLProject } = defineGraphQLProject({ Project });
  const { GraphQLTaskUnit } = defineGraphQLTaskUnit({ TaskUnit });
  const {
    GraphQLTimeUnit,
    GraphQLTimeUnitTaskUnitConnection,
  } = defineGraphQLTimeUnit({
    TimeUnit,
    GraphQLTaskUnit,
  });
  const { GraphQLDailyReport } = defineGraphQLDailyReport({ DailyReport });
  const {
    GraphQLDailySchedule,
    GraphQLDailyScheduleTimeUnitConnection,
  } = defineGraphQLDailySchedule({
    DailySchedule,
    GraphQLDailyReport,
    GraphQLTimeUnit,
    DailyReport,
  });
  const {
    GraphQLUser,
    GraphQLUserProjectConnection,
    GraphQLUserTaskUnitConnection,
  } = defineGraphQLUser({
    DailySchedule,
    GraphQLDailySchedule,
    GraphQLProject,
    GraphQLTaskUnit,
    User,
    nodeInterface,
  });

  nodeTypeMapper.mapTypes({
    DailyReport: GraphQLDailyReport,
    DailySchedule: GraphQLDailySchedule,
    Project: GraphQLProject,
    TaskUnit: GraphQLTaskUnit,
    TimeUnit: GraphQLTimeUnit,
    User: GraphQLUser,
  });

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
