import bootstrapGraphQLServer from './data/boot/bootstrapGraphQLServer';
import bootstrapDevServer from './data/boot/bootstrapDevServer';
import generateFakeData from './data/boot/generateFakeData';
import prepareBackend from './data/boot/prepareBackend';
import FakeAuthService from './data/services/FakeAuthService';

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
