import * as path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { IPartialSchemaDefinition, IModels } from './interfaces';
import fileLoaderTs from './utils/fileLoaderTs';

interface Input {
  models: IModels;
}

function createRawSchema({ models }: Input): IPartialSchemaDefinition {
  return {
    typeDefs: mergeTypes(fileLoader(path.join(__dirname, './typeDefs'))),
    resolvers: mergeResolvers(
      fileLoaderTs(path.join(__dirname, './resolvers')).map(createResolver =>
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
