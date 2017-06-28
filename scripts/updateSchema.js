import fs from 'fs';
import path from 'path';
import defineSchema from '../data/boot/defineSchema';
import connectDatabase from '../data/boot/connectDatabase';
import { printSchema } from 'graphql';

const schemaPath = path.resolve(__dirname, '../data/schema.graphql');

async function updateSchema() {
  const { models, sequelize } = await connectDatabase({ noSync: true });
  const schema = defineSchema({ models, sequelize });
  fs.writeFileSync(schemaPath, printSchema(schema));
  console.log('Wrote ' + schemaPath);
}

updateSchema()
  .then(console.log.bind(console))
  .catch(console.error.bind(console));
