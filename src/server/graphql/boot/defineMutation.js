import { GraphQLObjectType } from 'graphql';
import { globalIdField, mutationWithClientMutationId } from 'graphql-relay';
import defineGraphQLAddTaskUnitMutation from '../mutations/GraphQLAddTaskUnitMutation';
import defineGraphQLCreateProjectMutation from '../mutations/GraphQLCreateProjectMutation';
import defineGraphQLCreateTaskSetMutation from '../mutations/GraphQLCreateTaskSetMutation';
import defineGraphQLCreateTimeUnitMutation from '../mutations/GraphQLCreateTimeUnitMutation';
import defineGraphQLLinkProjectMutation from '../mutations/GraphQLLinkProjectMutation';
import defineGraphQLRemoveProjectMutation from '../mutations/GraphQLRemoveProjectMutation';
import defineGraphQLRemoveTaskSetMutation from '../mutations/GraphQLRemoveTaskSetMutation';
import defineGraphQLRemoveTimeUnitMutation from '../mutations/GraphQLRemoveTimeUnitMutation';

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

export default function defineMutation({ models, queries }) {
  const {
    GraphQLCreateTimeUnitMutation,
  } = defineGraphQLCreateTimeUnitMutation({
    models,
    queries,
  });

  const { GraphQLAddTaskUnitMutation } = defineGraphQLAddTaskUnitMutation({
    models,
    queries,
  });

  const { GraphQLLinkProjectMutation } = defineGraphQLLinkProjectMutation({
    models,
    queries,
  });

  const { GraphQLCreateTaskSetMutation } = defineGraphQLCreateTaskSetMutation({
    models,
    queries,
  });

  const { GraphQLRemoveTaskSetMutation } = defineGraphQLRemoveTaskSetMutation({
    models,
    queries,
  });

  const {
    GraphQLRemoveTimeUnitMutation,
  } = defineGraphQLRemoveTimeUnitMutation({
    models,
    queries,
  });

  const { GraphQLCreateProjectMutation } = defineGraphQLCreateProjectMutation({
    models,
    queries,
  });

  const { GraphQLRemoveProjectMutation } = defineGraphQLRemoveProjectMutation({
    models,
    queries,
  });

  const GraphQLMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...createStubMutationFields([
        'CreateDailyReport',
        'CreateDailyReportTemplate',
        'RemoveDailyReport',
        'RemoveDailyReportTemplate',
        'UpdateDailyReport',
        'UpdateDailyReportTemplate',
        'UpdateProject',
        'UpdateTaskSet',
        'UpdateTimeUnit',
      ]),
      addTaskUnit: GraphQLAddTaskUnitMutation,
      createProject: GraphQLCreateProjectMutation,
      createTaskSet: GraphQLCreateTaskSetMutation,
      createTimeUnit: GraphQLCreateTimeUnitMutation,
      linkProject: GraphQLLinkProjectMutation,
      removeProject: GraphQLRemoveProjectMutation,
      removeTaskSet: GraphQLRemoveTaskSetMutation,
      removeTimeUnit: GraphQLRemoveTimeUnitMutation,
    },
  });

  return {
    GraphQLMutation,
  };
}
