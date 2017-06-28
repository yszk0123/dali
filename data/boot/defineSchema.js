import { GraphQLSchema } from 'graphql';
import { relay } from 'graphql-sequelize';
import defineQuery from './defineQuery';
import defineMutation from './defineMutation';
const { sequelizeNodeInterface } = relay;

export default function defineSchema({ models, sequelize }) {
  const { nodeInterface, nodeField, nodeTypeMapper } = sequelizeNodeInterface(
    sequelize,
  );
  const { GraphQLQuery } = defineQuery({
    models,
    nodeInterface,
    nodeField,
    nodeTypeMapper,
  });
  const { GraphQLMutation } = defineMutation({
    models,
  });

  return new GraphQLSchema({
    query: GraphQLQuery,
    mutation: GraphQLMutation,
  });
}
