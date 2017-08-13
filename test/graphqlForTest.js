import { graphql, formatError } from 'graphql';

// TODO: Better error output
export default async function graphqlForTest(...args) {
  const result = await graphql(...args);

  if (result.errors) {
    throw new Error(
      result.errors.map(formatError).map(error => error.message).join('\n'),
    );
  }

  return result;
}
