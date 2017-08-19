import bootstrapGraphQLServer from './express/boot/bootstrapGraphQLServer';
import bootstrapDevAppServer from './express/boot/bootstrapDevAppServer';
import prepareBackend from './express/boot/prepareBackend';
import FakeAuthService from './express/services/FakeAuthService';

function composeServices() {
  return {
    AuthService: FakeAuthService,
  };
}

async function main() {
  try {
    const { models, schema } = await prepareBackend();
    const services = composeServices();

    await bootstrapGraphQLServer({
      services,
      models,
      schema,
    });

    await bootstrapDevAppServer();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
