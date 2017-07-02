import bootstrapGraphQLServer from './src/server/boot/bootstrapGraphQLServer';
import bootstrapDevServer from './src/server/boot/bootstrapDevServer';
import generateFakeData from './src/server/boot/generateFakeData';
import prepareBackend from './src/server/boot/prepareBackend';
import FakeAuthService from './src/server/services/FakeAuthService';

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

    await bootstrapDevServer();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
