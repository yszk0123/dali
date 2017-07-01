[![Build Status](https://travis-ci.org/yszk0123/dali.svg?branch=master)](https://travis-ci.org/yszk0123/dali)
[![Coverage Status](https://coveralls.io/repos/github/yszk0123/dali/badge.svg?branch=master)](https://coveralls.io/github/yszk0123/dali?branch=master)

# Environment Variables

Create a `.env` file in the root directory.

## Example

```
APP_PORT=3000
DATABASE_URL="postgres://foobar:password@localhost:5432/dali"
GRAPHQL_PORT=3001
SECRET="secret"
```

# Development

- `$ npm install` installs dependencies
- `$ npm run watch` watches file change
- `$ npm start` starts the development server
- `$ npm test` runs the complete test suite

## How to Update Schema

- `$ npm run update:schema` updates schema file
- `$ npm start` restarts the server

Make sure to commit `schema.graphql` after update.
