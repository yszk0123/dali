/**
 * This function is workaround for merge-graphql-schemas
 * which currently doesn't support .ts and .tsx.
 */
import * as fs from 'fs';
import * as path from 'path';

function readDirSync(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter(file => /.(js|jsx|ts|tsx)$/.test(file))
    .filter(file => !fs.statSync(path.join(dir, file)).isDirectory())
    .map(file => path.join(dir, file));
}

export default function fileLoaderTs(dir: string): any[] {
  return readDirSync(dir).map((file: string) => {
    const resolver = require(file);
    return resolver.default;
  });
}
