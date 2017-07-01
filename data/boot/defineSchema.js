import { GraphQLSchema } from 'graphql';
import { relay } from 'graphql-sequelize';
import defineQuery from './defineQuery';
import defineMutation from './defineMutation';
const { sequelizeNodeInterface } = relay;

export default function defineSchema({ models, sequelize }) {
  const { nodeInterface, nodeField, nodeTypeMapper } = sequelizeNodeInterface(
    sequelize,
  );
  const queries = defineQuery({
    models,
    nodeInterface,
    nodeField,
    nodeTypeMapper,
  });
  const { GraphQLQuery } = queries;
  const { GraphQLMutation } = defineMutation({
    models,
    queries,
  });

  return new GraphQLSchema({
    query: GraphQLQuery,
    mutation: GraphQLMutation,
  });
}
