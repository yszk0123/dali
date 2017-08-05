import fs from 'fs';
import path from 'path';
import { printSchema } from 'graphql';
import { createSchema } from '../src/server/graphql';
import { connectDatabase } from '../src/server/database';

const schemaPath = path.resolve(__dirname, '../data/schema.graphql');

async function generateSchema() {
  const { models, sequelize } = await connectDatabase();
  const schema = createSchema({ models });
  fs.writeFileSync(schemaPath, printSchema(schema));
  console.log('Wrote ' + schemaPath);
  await sequelize.close();
}

generateSchema()
  .then(console.log.bind(console))
  .catch(console.error.bind(console));
