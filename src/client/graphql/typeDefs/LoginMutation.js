/* @flow */
import type { LoginMutationVariables } from 'schema.graphql';
import query from './LoginMutation.graphql';

type Input = LoginMutationVariables;

async function commit(mutate: any, { client, email, password }: Input) {
  await mutate({
    variables: {
      email,
      password,
    },
  });
}

export default { commit, query };
