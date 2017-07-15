import { Environment, Network, RecordSource, Store } from 'relay-runtime';

function prettyFetchErrors(errors) {
  return errors.map(error => error.message).join('\n');
}

async function fetchQuery(operation, variables) {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    });

    const data = await response.json();
    if (data.errors) {
      console.error(prettyFetchErrors(data.errors));
    }

    return data;
  } catch (error) {
    console.error(error);
  }
}

export default function createEnvironment() {
  return new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),
  });
}
