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
  addRound,
  getUserById,
  getViewer,
  getProjects,
  getRounds,
  getRoundById,
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

// Round

const GraphQLRound = new GraphQLObjectType({
  name: 'Round',
  fields: {
    id: globalIdField('Round'),
    title: {
      type: GraphQLString,
      resolve: obj => obj.title,
    },
  },
});

const {
  connectionType: GraphQLRoundsConnection,
  edgeType: GraphQLRoundEdge,
} = connectionDefinitions({
  name: 'Round',
  nodeType: GraphQLRound,
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
    rounds: {
      type: GraphQLRoundsConnection,
      args: connectionArgs,
      resolve: (obj, args) => connectionFromArray(getRounds(), args),
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

const GraphQLAddRoundMutation = mutationWithClientMutationId({
  name: 'AddRound',
  inputFields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    roundEdge: {
      type: GraphQLRoundEdge,
      resolve: ({ localRoundId }) => {
        const round = getRoundById(localRoundId);

        return {
          cursor: cursorForObjectInConnection(getRounds(), round),
          node: round,
        };
      },
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({ title }) => {
    const localRoundId = addRound({ title });

    return { localRoundId };
  },
});

const GraphQLMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addRound: GraphQLAddRoundMutation,
  },
});

// Schema

export const schema = new GraphQLSchema({
  query: GraphQLQuery,
  mutation: GraphQLMutation,
});
