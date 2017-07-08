import { GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

export default function defineGraphQLDailyReport({ models: { DailyReport } }) {
  const GraphQLDailyReport = new GraphQLObjectType({
    name: 'DailyReport',
    fields: {
      ...attributeFields(DailyReport, {
        globalId: true,
      }),
    },
  });

  return { GraphQLDailyReport };
}
