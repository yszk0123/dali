import { GraphQLObjectType } from 'graphql';
import defineGraphQLProject from '../queries/GraphQLProject';
import defineGraphQLTaskSet from '../queries/GraphQLTaskSet';
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

  const {
    GraphQLTaskSet,
    // GraphQLTaskSetTaskUnitConnection,
  } = defineGraphQLTaskSet({ GraphQLProject, models });

  const { GraphQLTaskUnit } = defineGraphQLTaskUnit({
    GraphQLTaskSet,
    models,
  });

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
    GraphQLTaskSet,
    // GraphQLTaskSetTaskUnitConnection,
    GraphQLTaskUnit,
    GraphQLTimeUnit,
    GraphQLTimeUnitTaskUnitConnection,
    GraphQLUser,
    GraphQLUserProjectConnection,
    GraphQLUserTaskSetConnection,
  };
}
