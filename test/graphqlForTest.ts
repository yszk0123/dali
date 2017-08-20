import { graphql, formatError, ExecutionResult, GraphQLSchema } from 'graphql';

// TODO: Better error output
export default async function graphqlForTest(
  schema: GraphQLSchema,
  requestString: string,
  rootValue?: any,
  contextValue?: any,
  variableValues?: {
    [key: string]: any;
  },
  operationName?: string,
): Promise<ExecutionResult> {
  const result = await graphql(
    schema,
    requestString,
    rootValue,
    contextValue,
    variableValues,
    operationName,
  );

  if (result.errors) {
    throw new Error(
      result.errors.map(formatError).map(error => error.message).join('\n'),
    );
  }

  return result;
}
