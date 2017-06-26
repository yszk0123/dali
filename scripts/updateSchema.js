import fs from 'fs';
import path from 'path';
import { createSchema } from '../data/schema';
import connectDatabase from '../data/connectDatabase';
import { printSchema } from 'graphql';

const schemaPath = path.resolve(__dirname, '../data/schema.graphql');

async function updateSchema() {
  const { models, sequelize } = await connectDatabase({ noSync: true });
  const schema = createSchema({ models, sequelize });
  fs.writeFileSync(schemaPath, printSchema(schema));
  console.log('Wrote ' + schemaPath);
}

updateSchema()
  .then(console.log.bind(console))
  .catch(console.error.bind(console));
