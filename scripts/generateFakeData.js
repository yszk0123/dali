/* @flow */
import { connectDatabase } from '../dist/server/database';
import generateFakeData from '../dist/server/generateFakeData';

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
