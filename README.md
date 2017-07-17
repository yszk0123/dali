[![Build Status](https://travis-ci.org/yszk0123/dali.svg?branch=master)](https://travis-ci.org/yszk0123/dali)
[![Coverage Status](https://coveralls.io/repos/github/yszk0123/dali/badge.svg?branch=master)](https://coveralls.io/github/yszk0123/dali?branch=master)

# Environment Variables

Create a `.env` file in the root directory.

## Example

```
APP_PORT=3000
DATABASE_URL=postgres://foobar:password@localhost:5432/dali
GRAPHQL_PORT=3001
POSTGRES_DB=dali
POSTGRES_PASSWORD=password
POSTGRES_USER=foobar
SECRET=secret
```

# Development

- `$ yarn` installs dependencies
- `$ yarn dev:watch` watches file change
- `$ yarn dev:start` starts the development server
- `$ yarn test` runs the complete test suite

## How to Update Schema

- `$ yarn update:schema` updates schema file
- `$ yarn dev:start` restarts the server

Make sure to commit `schema.graphql` after update.

# [WIP] Deploy

1. `$ yarn release`
1. `$ docker build -t yszk0123/dali-app .`
1. `$ docker-compose -f docker-compose.production.yml up`
