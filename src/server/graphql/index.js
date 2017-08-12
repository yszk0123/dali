/* @flow */
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import type { IPartialSchemaDefinition, IModels } from './interfaces';

type Input = {
  models: IModels,
};

function createRawSchema({ models }: Input): IPartialSchemaDefinition {
  return {
    typeDefs: mergeTypes(fileLoader(path.join(__dirname, './typeDefs'))),
    resolvers: mergeResolvers(
      fileLoader(path.join(__dirname, './resolvers')).map(createResolver =>
        createResolver({ models }),
      ),
    ),
  };
}

export function createSchema({ models }: Input): any {
  const schema = makeExecutableSchema(createRawSchema({ models }));

  addMockFunctionsToSchema({ schema, preserveResolvers: true });

  return schema;
}
