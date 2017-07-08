import { GraphQLObjectType } from 'graphql';
import { globalIdField, mutationWithClientMutationId } from 'graphql-relay';
import defineGraphQLCreateProjectMutation from '../mutations/GraphQLCreateProjectMutation';
import defineGraphQLCreateTaskUnitMutation from '../mutations/GraphQLCreateTaskUnitMutation';
import defineGraphQLCreateTimeUnitMutation from '../mutations/GraphQLCreateTimeUnitMutation';
import defineGraphQLLinkProjectMutation from '../mutations/GraphQLLinkProjectMutation';
import defineGraphQLLinkTaskUnitMutation from '../mutations/GraphQLLinkTaskUnitMutation';
import defineGraphQLRemoveProjectMutation from '../mutations/GraphQLRemoveProjectMutation';
import defineGraphQLRemoveTaskUnitMutation from '../mutations/GraphQLRemoveTaskUnitMutation';

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

  const { GraphQLLinkTaskUnitMutation } = defineGraphQLLinkTaskUnitMutation({
    models,
    queries,
  });

  const { GraphQLLinkProjectMutation } = defineGraphQLLinkProjectMutation({
    models,
    queries,
  });

  const {
    GraphQLCreateTaskUnitMutation,
  } = defineGraphQLCreateTaskUnitMutation({ models, queries });

  const {
    GraphQLRemoveTaskUnitMutation,
  } = defineGraphQLRemoveTaskUnitMutation({ models, queries });

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
        'RemoveTimeUnit',
        'UpdateDailyReport',
        'UpdateDailyReportTemplate',
        'UpdateProject',
        'UpdateTaskUnit',
        'UpdateTimeUnit',
      ]),
      createProject: GraphQLCreateProjectMutation,
      createTaskUnit: GraphQLCreateTaskUnitMutation,
      createTimeUnit: GraphQLCreateTimeUnitMutation,
      linkProject: GraphQLLinkProjectMutation,
      linkTaskUnit: GraphQLLinkTaskUnitMutation,
      removeProject: GraphQLRemoveProjectMutation,
      removeTaskUnit: GraphQLRemoveTaskUnitMutation,
    },
  });

  return {
    GraphQLMutation,
  };
}
