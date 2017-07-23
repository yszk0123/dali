[![Build Status](https://travis-ci.org/yszk0123/dali.svg?branch=master)](https://travis-ci.org/yszk0123/dali)
[![Coverage Status](https://coveralls.io/repos/github/yszk0123/dali/badge.svg?branch=master)](https://coveralls.io/github/yszk0123/dali?branch=master)

# Environment Variables

Create a `.env` file in the root directory.

## Example

`.env`:

```
NGINX_FILES_PATH=./nginx
POSTGRES_DB=dali
POSTGRES_PASSWORD=password
POSTGRES_USER=foobar
```

`app.env`:

```
APP_PORT=80
DATABASE_URL=postgres://foobar:password@dali-database:5432/dali
GRAPHQL_PORT=3001
SECRET=secret
```

# Development

- `$ yarn` installs dependencies
- `$ yarn dev:watch` watches file change
- `$ yarn dev:start` starts the development server
- `$ yarn test` runs the complete test suite
- `$ docker-compose -f docker-compose.yml -f docker-compose.development.yml up -d` prepares services

## How to Update Schema

- `$ yarn update:schema` updates schema file
- `$ yarn dev:start` restarts the server

Make sure to commit `schema.graphql` after update.

# [WIP] Deploy

1. `$ yarn release`
1. `$ docker build -t yszk0123/dali-app .`
1. `$ docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d`

# Backup database

- `$ <path/to/repo>/scripts/backup-database <path/to/backup/dir>`

You might need execute the command as root.
