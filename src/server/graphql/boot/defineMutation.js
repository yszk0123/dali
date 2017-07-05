import { GraphQLObjectType } from 'graphql';
import { globalIdField, mutationWithClientMutationId } from 'graphql-relay';
import defineGraphQLCreateTaskUnitMutation from '../mutations/GraphQLCreateTaskUnitMutation';
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
  // const GraphQLAddTimeUnitMutation = mutationWithClientMutationId({
  //   name: 'AddTimeUnit',
  //   inputFields: {
  //     title: { type: new GraphQLNonNull(GraphQLString) },
  //   },
  //   outputFields: {
  //     timeUnitEdge: {
  //       type: GraphQLTimeUnitEdge,
  //       resolve: ({ localTimeUnitId }) => {
  //         const timeUnit = getTimeUnitById(localTimeUnitId);
  //
  //         return {
  //           cursor: cursorForObjectInConnection(getTimeUnits(), timeUnit),
  //           node: timeUnit,
  //         };
  //       },
  //     },
  //     viewer: {
  //       type: GraphQLUser,
  //       resolve: (obj, args, { user }) => user,
  //     },
  //   },
  //   mutateAndGetPayload: ({ title }) => {
  //     const localTimeUnitId = addTimeUnit({ title });
  //
  //     return { localTimeUnitId };
  //   },
  // });
  const { TaskUnit } = models;
  const {
    GraphQLTaskUnitEdge,
    GraphQLUser,
    GraphQLUserTaskUnitConnection,
  } = queries;

  const {
    GraphQLCreateTaskUnitMutation,
  } = defineGraphQLCreateTaskUnitMutation({
    GraphQLTaskUnitEdge,
    GraphQLUser,
    GraphQLUserTaskUnitConnection,
    TaskUnit,
  });

  const {
    GraphQLRemoveTaskUnitMutation,
  } = defineGraphQLRemoveTaskUnitMutation({ models, queries });

  const GraphQLMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...createStubMutationFields([
        'AddTaskUnit',
        'AddTimeUnit',
        'CreateDailyReport',
        'CreateDailyReportTemplate',
        'CreateProject',
        'CreateTaskUnit',
        'CreateTimeUnit',
        'RemoveDailyReport',
        'RemoveDailyReportTemplate',
        'RemoveProject',
        'RemoveTimeUnit',
        'UpdateDailyReport',
        'UpdateDailyReportTemplate',
        'UpdateProject',
        'UpdateTaskUnit',
        'UpdateTimeUnit',
      ]),
      createTaskUnit: GraphQLCreateTaskUnitMutation,
      removeTaskUnit: GraphQLRemoveTaskUnitMutation,
    },
  });

  return {
    GraphQLMutation,
  };
}
