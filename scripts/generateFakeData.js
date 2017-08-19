/* @flow */
import { connectDatabase } from '../src/server/database';
import generateFakeData from '../src/server/generateFakeData';

async function run() {
  try {
    const { sequelize, models } = await connectDatabase();
    await sequelize.truncate({ cascade: true });
    await generateFakeData({ sequelize, models });
    await sequelize.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
