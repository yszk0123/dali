/* @flow */
import type { SignupMutationVariables } from 'schema.graphql';
import query from './SignupMutation.graphql';

async function commit(
  mutate: any,
  { email, password, nickname, firstName, lastName }: SignupMutationVariables,
) {
  await mutate({
    variables: {
      email,
      password,
      nickname,
      firstName,
      lastName,
    },
  });
}

export default { commit, query };
