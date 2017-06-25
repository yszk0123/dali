/* eslint-disable */
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
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';
import {
  addTimeUnit,
  getUserById,
  getViewer,
  getProjects,
  getTimeUnits,
  getTaskUnits,
  getTimeUnitById,
} from './database.js';

// Node

const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId);

    switch (type) {
      case 'User':
        return getUserById(id);
      default:
        return null;
    }
  },
  obj => {
    if (obj instanceof User) {
      return GraphQLUser;
    }
    return null;
  },
);

// Project

const GraphQLProject = new GraphQLObjectType({
  name: 'Project',
  fields: {
    id: globalIdField('Project'),
    title: {
      type: GraphQLString,
      resolve: obj => obj.title,
    },
  },
});

const {
  connectionType: GraphQLProjectsConnection,
  edgeType: GraphQLProjectEdge,
} = connectionDefinitions({
  name: 'Project',
  nodeType: GraphQLProject,
});

// TaskUnit

const GraphQLTaskUnit = new GraphQLObjectType({
  name: 'TaskUnit',
  fields: {
    id: globalIdField('TaskUnit'),
    createdAt: {
      type: GraphQLDate,
      resolve: obj => obj.createdAt,
    },
    modifiedAt: {
      type: GraphQLDate,
      resolve: obj => obj.modifiedAt,
    },
    title: {
      type: GraphQLString,
      resolve: obj => obj.title,
    },
  },
});

const {
  connectionType: GraphQLTaskUnitsConnection,
  edgeType: GraphQLTaskUnitEdge,
} = connectionDefinitions({
  name: 'TaskUnit',
  nodeType: GraphQLTaskUnit,
});

// TimeUnit

const GraphQLTimeUnit = new GraphQLObjectType({
  name: 'TimeUnit',
  fields: {
    id: globalIdField('TimeUnit'),
    position: {
      type: GraphQLInt,
      resolve: obj => obj.position,
    },
    taskUnits: {
      type: GraphQLTaskUnitsConnection,
      args: connectionArgs,
      resolve: (obj, args) => connectionFromArray(getTaskUnits(), args),
    },
  },
});

const {
  connectionType: GraphQLTimeUnitsConnection,
  edgeType: GraphQLTimeUnitEdge,
} = connectionDefinitions({
  name: 'TimeUnit',
  nodeType: GraphQLTimeUnit,
});

// User

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    name: {
      type: GraphQLString,
      resolve: obj => obj.name,
    },
    projects: {
      type: GraphQLProjectsConnection,
      args: connectionArgs,
      resolve: (obj, args) => connectionFromArray(getProjects(), args),
    },
    timeUnits: {
      type: GraphQLTimeUnitsConnection,
      args: connectionArgs,
      resolve: (obj, args) => connectionFromArray(getTimeUnits(), args),
    },
    taskUnits: {
      type: GraphQLTaskUnitsConnection,
      args: connectionArgs,
      resolve: (obj, args) => connectionFromArray(getTaskUnits(), args),
    },
  },
  interfaces: [nodeInterface],
});

// Query

const GraphQLQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
    node: nodeField,
  },
});

// Mutations

const GraphQLAddTimeUnitMutation = mutationWithClientMutationId({
  name: 'AddTimeUnit',
  inputFields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    timeUnitEdge: {
      type: GraphQLTimeUnitEdge,
      resolve: ({ localTimeUnitId }) => {
        const timeUnit = getTimeUnitById(localTimeUnitId);

        return {
          cursor: cursorForObjectInConnection(getTimeUnits(), timeUnit),
          node: timeUnit,
        };
      },
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({ title }) => {
    const localTimeUnitId = addTimeUnit({ title });

    return { localTimeUnitId };
  },
});

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
    addTimeUnit: GraphQLAddTimeUnitMutation,
  },
});

// Schema

export const schema = new GraphQLSchema({
  query: GraphQLQuery,
  mutation: GraphQLMutation,
});
