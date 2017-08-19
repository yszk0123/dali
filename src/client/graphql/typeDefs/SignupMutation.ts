import { SignupMutationVariables } from 'schema';
import * as query from './SignupMutation.graphql';

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
