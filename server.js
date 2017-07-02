import bootstrapGraphQLServer from './src/server/express/boot/bootstrapGraphQLServer';
import bootstrapAppServer from './src/server/express/boot/bootstrapAppServer';
import generateFakeData from './src/server/database/boot/generateFakeData';
import prepareBackend from './src/server/express/boot/prepareBackend';
import FakeAuthService from './src/server/express/services/FakeAuthService';

function composeServices() {
  return {
    AuthService: FakeAuthService,
  };
}

async function main() {
  try {
    const { models, schema } = await prepareBackend();
    const services = composeServices();

    await generateFakeData({ models });

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
