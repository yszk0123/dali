/* @flow */
// import { maskErrors } from 'graphql-errors';
import { connectDatabase } from './database';
import { createSchema } from './graphql';
import { setupAppServer, setupGraphQLServer, AuthService } from './express';
import type { IServices } from './graphql/interfaces';

function composeServices(): IServices {
  return {
    AuthService,
  };
}

async function setup() {
  try {
    const services = composeServices();
    const { models } = await connectDatabase();
    const schema = createSchema({ models });

    // TODO
    // maskErrors(schema);

    await setupGraphQLServer({ services, models, schema });
    await setupAppServer();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

setup();
