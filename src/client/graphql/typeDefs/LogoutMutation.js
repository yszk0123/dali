/* @flow */

async function commit(mutate: any) {
  await mutate();
}

export default { commit };
