import { GraphQLObjectType, GraphQLInt } from 'graphql';
import { attributeFields, relay, resolver } from 'graphql-sequelize';
const { sequelizeConnection } = relay;

export default function defineGraphQLTaskSet({
  GraphQLProject,
  models: { TaskSet },
}) {
  // const GraphQLTaskSetTaskUnitConnection = sequelizeConnection({
  //   name: 'TaskSetTaskUnit',
  //   nodeType: GraphQLTaskUnit,
  //   target: TaskSet.TaskUnits,
  //   connectionFields: {
  //     total: {
  //       type: GraphQLInt,
  //       resolve: ({ source }) => source.countTaskUnits(),
  //     },
  //   },
  // });

  const GraphQLTaskSet = new GraphQLObjectType({
    name: 'TaskSet',
    fields: {
      ...attributeFields(TaskSet, {
        globalId: true,
      }),
      project: {
        type: GraphQLProject,
        resolve: resolver(TaskSet.Project),
      },
      // taskUnits: {
      //   type: GraphQLTaskSetTaskUnitConnection.connectionType,
      //   args: GraphQLTaskSetTaskUnitConnection.connectionArgs,
      //   resolve: GraphQLTaskSetTaskUnitConnection.resolve,
      // },
    },
  });

  return { GraphQLTaskSet };
}
