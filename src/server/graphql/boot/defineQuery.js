import { GraphQLObjectType } from 'graphql';
import defineGraphQLProject from '../queries/GraphQLProject';
import defineGraphQLTaskUnit from '../queries/GraphQLTaskUnit';
import defineGraphQLTimeUnit from '../queries/GraphQLTimeUnit';
import defineGraphQLDailyReport from '../queries/GraphQLDailyReport';
import defineGraphQLDailySchedule from '../queries/GraphQLDailySchedule';
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
    GraphQLDailySchedule,
    GraphQLDailyScheduleTimeUnitConnection,
  } = defineGraphQLDailySchedule({
    GraphQLDailyReport,
    GraphQLTimeUnit,
    models,
  });

  const {
    GraphQLUser,
    GraphQLUserProjectConnection,
    GraphQLUserTaskUnitConnection,
  } = defineGraphQLUser({
    GraphQLDailySchedule,
    GraphQLProject,
    GraphQLTaskUnit,
    models,
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
        resolve: (obj, args, { user }) => user,
      },
      node: nodeField,
    },
  });

  return {
    GraphQLDailyReport,
    GraphQLDailySchedule,
    GraphQLDailyScheduleTimeUnitConnection,
    GraphQLProject,
    GraphQLQuery,
    GraphQLTaskUnit,
    GraphQLTimeUnit,
    GraphQLTimeUnitTaskUnitConnection,
    GraphQLUser,
    GraphQLUserProjectConnection,
    GraphQLUserTaskUnitConnection,
  };
}
