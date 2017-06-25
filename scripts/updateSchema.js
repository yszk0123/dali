import fs from 'fs';
import path from 'path';
import { createSchema } from '../data/schema';
import { printSchema } from 'graphql';

const schemaPath = path.resolve(__dirname, '../data/schema.graphql');
const dummyModels = {};

const schema = createSchema({ models: dummyModels });

fs.writeFileSync(schemaPath, printSchema(schema));

console.log('Wrote ' + schemaPath);
