import { GraphQLObjectType } from 'graphql';
import { globalIdField, mutationWithClientMutationId } from 'graphql-relay';
import defineGraphQLCreateProjectMutation from '../mutations/GraphQLCreateProjectMutation';
import defineGraphQLCreateTaskSetMutation from '../mutations/GraphQLCreateTaskSetMutation';
import defineGraphQLCreateTimeUnitMutation from '../mutations/GraphQLCreateTimeUnitMutation';
import defineGraphQLLinkProjectMutation from '../mutations/GraphQLLinkProjectMutation';
import defineGraphQLLinkTaskSetMutation from '../mutations/GraphQLLinkTaskSetMutation';
import defineGraphQLRemoveProjectMutation from '../mutations/GraphQLRemoveProjectMutation';
import defineGraphQLRemoveTaskSetMutation from '../mutations/GraphQLRemoveTaskSetMutation';

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

  const { GraphQLLinkTaskSetMutation } = defineGraphQLLinkTaskSetMutation({
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
        'UpdateTaskSet',
        'UpdateTimeUnit',
      ]),
      createProject: GraphQLCreateProjectMutation,
      createTaskSet: GraphQLCreateTaskSetMutation,
      createTimeUnit: GraphQLCreateTimeUnitMutation,
      linkProject: GraphQLLinkProjectMutation,
      linkTaskSet: GraphQLLinkTaskSetMutation,
      removeProject: GraphQLRemoveProjectMutation,
      removeTaskSet: GraphQLRemoveTaskSetMutation,
    },
  });

  return {
    GraphQLMutation,
  };
}
