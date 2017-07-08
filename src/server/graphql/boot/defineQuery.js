import { GraphQLObjectType } from 'graphql';
import defineGraphQLProject from '../queries/GraphQLProject';
import defineGraphQLTaskUnit from '../queries/GraphQLTaskUnit';
import defineGraphQLTimeUnit from '../queries/GraphQLTimeUnit';
import defineGraphQLDailyReport from '../queries/GraphQLDailyReport';
import defineGraphQLUser from '../queries/GraphQLUser';

export default function defineQuery({
  models,
  nodeInterface,
  nodeField,
  nodeTypeMapper,
}) {
  const { GraphQLProject } = defineGraphQLProject({ models });

  const { GraphQLTaskUnit } = defineGraphQLTaskUnit({ models });

  const {
    GraphQLTimeUnit,
    GraphQLTimeUnitTaskUnitConnection,
  } = defineGraphQLTimeUnit({ models, GraphQLTaskUnit });

  const { GraphQLDailyReport } = defineGraphQLDailyReport({ models });

  const {
    GraphQLUser,
    GraphQLUserProjectConnection,
    GraphQLUserTaskUnitConnection,
    GraphQLUserTimeUnitConnection,
  } = defineGraphQLUser({
    GraphQLDailyReport,
    GraphQLProject,
    GraphQLTaskUnit,
    GraphQLTimeUnit,
    models,
    nodeInterface,
  });

  nodeTypeMapper.mapTypes({
    DailyReport: GraphQLDailyReport,
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
        resolve: (obj, args, { user }) => user,
      },
      node: nodeField,
    },
  });

  return {
    GraphQLDailyReport,
    GraphQLProject,
    GraphQLQuery,
    GraphQLTaskUnit,
    GraphQLTimeUnit,
    GraphQLTimeUnitTaskUnitConnection,
    GraphQLUser,
    GraphQLUserProjectConnection,
    GraphQLUserTaskUnitConnection,
    GraphQLUserTimeUnitConnection,
  };
}
