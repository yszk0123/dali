import { GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

export default function defineGraphQLProject({ Project }) {
  const GraphQLProject = new GraphQLObjectType({
    name: 'Project',
    fields: attributeFields(Project, {
      globalId: true,
    }),
  });

  return { GraphQLProject };
}
