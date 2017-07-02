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
  const {
    DailyReport,
    DailySchedule,
    Project,
    TaskUnit,
    TimeUnit,
    User,
  } = models;

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
