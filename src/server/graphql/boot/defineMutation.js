import { GraphQLObjectType } from 'graphql';
import { globalIdField, mutationWithClientMutationId } from 'graphql-relay';
import defineGraphQLAddTaskUnitMutation from '../mutations/GraphQLAddTaskUnitMutation';
import defineGraphQLCreateDailyScheduleMutation from '../mutations/GraphQLCreateDailyScheduleMutation';
import defineGraphQLCreateProjectMutation from '../mutations/GraphQLCreateProjectMutation';
import defineGraphQLCreateTaskSetMutation from '../mutations/GraphQLCreateTaskSetMutation';
import defineGraphQLCreateTimeUnitMutation from '../mutations/GraphQLCreateTimeUnitMutation';
import defineGraphQLLinkProjectMutation from '../mutations/GraphQLLinkProjectMutation';
import defineGraphQLLoginMutation from '../mutations/GraphQLLoginMutation';
import defineGraphQLLogoutMutation from '../mutations/GraphQLLogoutMutation';
import defineGraphQLRemoveProjectMutation from '../mutations/GraphQLRemoveProjectMutation';
import defineGraphQLRemoveTaskSetMutation from '../mutations/GraphQLRemoveTaskSetMutation';
import defineGraphQLRemoveTaskUnitMutation from '../mutations/GraphQLRemoveTaskUnitMutation';
import defineGraphQLRemoveTimeUnitMutation from '../mutations/GraphQLRemoveTimeUnitMutation';
import defineGraphQLSignupMutation from '../mutations/GraphQLSignupMutation';
import defineGraphQLUpdateProjectMutation from '../mutations/GraphQLUpdateProjectMutation';
import defineGraphQLUpdateTaskSetMutation from '../mutations/GraphQLUpdateTaskSetMutation';
import defineGraphQLUpdateTimeUnitMutation from '../mutations/GraphQLUpdateTimeUnitMutation';

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
  } = defineGraphQLRemoveTimeUnitMutation({ models, queries });

  const {
    GraphQLRemoveTaskUnitMutation,
  } = defineGraphQLRemoveTaskUnitMutation({ models, queries });

  const {
    GraphQLCreateDailyScheduleMutation,
  } = defineGraphQLCreateDailyScheduleMutation({ models, queries });

  const { GraphQLCreateProjectMutation } = defineGraphQLCreateProjectMutation({
    models,
    queries,
  });

  const { GraphQLRemoveProjectMutation } = defineGraphQLRemoveProjectMutation({
    models,
    queries,
  });

  const {
    GraphQLUpdateTimeUnitMutation,
  } = defineGraphQLUpdateTimeUnitMutation({ models, queries });

  const { GraphQLUpdateTaskSetMutation } = defineGraphQLUpdateTaskSetMutation({
    models,
    queries,
  });

  const { GraphQLUpdateProjectMutation } = defineGraphQLUpdateProjectMutation({
    models,
    queries,
  });

  const { GraphQLSignupMutation } = defineGraphQLSignupMutation({
    models,
    queries,
  });

  const { GraphQLLoginMutation } = defineGraphQLLoginMutation({
    models,
    queries,
  });

  const { GraphQLLogoutMutation } = defineGraphQLLogoutMutation({
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
      ]),
      addTaskUnit: GraphQLAddTaskUnitMutation,
      createDailySchedule: GraphQLCreateDailyScheduleMutation,
      createProject: GraphQLCreateProjectMutation,
      createTaskSet: GraphQLCreateTaskSetMutation,
      createTimeUnit: GraphQLCreateTimeUnitMutation,
      linkProject: GraphQLLinkProjectMutation,
      login: GraphQLLoginMutation,
      logout: GraphQLLogoutMutation,
      removeProject: GraphQLRemoveProjectMutation,
      removeTaskSet: GraphQLRemoveTaskSetMutation,
      removeTaskUnit: GraphQLRemoveTaskUnitMutation,
      removeTimeUnit: GraphQLRemoveTimeUnitMutation,
      signup: GraphQLSignupMutation,
      updateProject: GraphQLUpdateProjectMutation,
      updateTaskSet: GraphQLUpdateTaskSetMutation,
      updateTimeUnit: GraphQLUpdateTimeUnitMutation,
    },
  });

  return {
    GraphQLMutation,
  };
}
