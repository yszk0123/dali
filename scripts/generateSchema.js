import fs from 'fs';
import path from 'path';
import { printSchema } from 'graphql';
import defineSchema from '../src/server/graphql/boot/defineSchema';
import connectDatabase from '../src/server/database/boot/connectDatabase';

const schemaPath = path.resolve(__dirname, '../data/schema.graphql');

async function generateSchema() {
  const { models, sequelize } = await connectDatabase();
  const schema = defineSchema({ models, sequelize });
  fs.writeFileSync(schemaPath, printSchema(schema));
  console.log('Wrote ' + schemaPath);
}

generateSchema()
  .then(console.log.bind(console))
  .catch(console.error.bind(console));
