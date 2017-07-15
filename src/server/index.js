import bootstrapGraphQLServer from './express/boot/bootstrapGraphQLServer';
import bootstrapAppServer from './express/boot/bootstrapAppServer';
import prepareBackend from './express/boot/prepareBackend';
import AuthService from './express/services/AuthService';

function composeServices() {
  return {
    AuthService,
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

    await bootstrapAppServer();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();