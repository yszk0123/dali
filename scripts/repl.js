/**
 * Simple Sequqlize REPL
 *
 * @example
 * $ node -r babel-register -r ./repl.js
 * > User.findAll()
 */
import { connectDatabase } from '../src/server/database';

function print(value) {
  if (value && value.then) {
    value
      .then(resolvedValue => console.log(resolvedValue))
      .catch(error => console.error(error));
    return;
  }

  console.log(value);
}

connectDatabase()
  .then(async ({ models }) => {
    global.print = global.p = print;

    // Expose all models to global for convenience
    Object.keys(models).forEach(name => {
      global[name] = models[name];
    });
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
