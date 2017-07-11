import { GraphQLObjectType } from 'graphql';
import defineGraphQLProject from '../queries/GraphQLProject';
import defineGraphQLTaskSet from '../queries/GraphQLTaskSet';
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

  const { GraphQLTaskSet } = defineGraphQLTaskSet({ GraphQLProject, models });

  const {
    GraphQLTimeUnit,
    GraphQLTimeUnitTaskSetConnection,
  } = defineGraphQLTimeUnit({ models, GraphQLTaskSet });

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
    GraphQLUserTaskSetConnection,
  } = defineGraphQLUser({
    GraphQLDailySchedule,
    GraphQLProject,
    GraphQLTaskSet,
    models,
    nodeInterface,
  });

  nodeTypeMapper.mapTypes({
    DailyReport: GraphQLDailyReport,
    DailySchedule: GraphQLDailySchedule,
    Project: GraphQLProject,
    TaskSet: GraphQLTaskSet,
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
    GraphQLTaskSet,
    GraphQLTimeUnit,
    GraphQLTimeUnitTaskSetConnection,
    GraphQLUser,
    GraphQLUserProjectConnection,
    GraphQLUserTaskSetConnection,
  };
}
