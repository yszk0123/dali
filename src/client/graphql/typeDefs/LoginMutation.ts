import { LoginMutationVariables } from 'schema';
import * as query from './LoginMutation.graphql';

async function commit(
  mutate: any,
  { email, password }: LoginMutationVariables,
) {
  await mutate({
    variables: {
      email,
      password,
    },
  });
}

export default { commit, query };
