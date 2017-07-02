import defineSchema from '../graphql/boot/defineSchema';
import connectDatabase from './connectDatabase';

export default async function prepareBackend() {
  const { models, sequelize } = await connectDatabase();

  const schema = defineSchema({ models, sequelize });

  return { models, schema };
}
