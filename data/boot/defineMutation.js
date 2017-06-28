import { GraphQLObjectType } from 'graphql';
import { globalIdField, mutationWithClientMutationId } from 'graphql-relay';

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

export default function defineMutation({ models }) {
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
  //       // TODO: Implement authentication
  //       resolve: () => User.findOne(),
  //     },
  //   },
  //   mutateAndGetPayload: ({ title }) => {
  //     const localTimeUnitId = addTimeUnit({ title });
  //
  //     return { localTimeUnitId };
  //   },
  // });

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
        'RemoveTaskUnit',
        'RemoveTimeUnit',
        'UpdateDailyReport',
        'UpdateDailyReportTemplate',
        'UpdateProject',
        'UpdateTaskUnit',
        'UpdateTimeUnit',
      ]),
      // addTimeUnit: GraphQLAddTimeUnitMutation,
    },
  });

  return {
    GraphQLMutation,
  };
}
