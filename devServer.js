import bootstrapGraphQLServer from './src/server/express/boot/bootstrapGraphQLServer';
import bootstrapDevAppServer from './src/server/express/boot/bootstrapDevAppServer';
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

    await bootstrapDevAppServer();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
