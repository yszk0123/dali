[![Build Status](https://travis-ci.org/yszk0123/dali.svg?branch=master)](https://travis-ci.org/yszk0123/dali)
[![Coverage Status](https://coveralls.io/repos/github/yszk0123/dali/badge.svg?branch=master)](https://coveralls.io/github/yszk0123/dali?branch=master)

# Environment Variables

Create a `.env` file in the root directory.

## Example

`.env`:

```
APP_PORT=80
GRAPHQL_PORT=3001
WEBPACK_PORT=3002

NGINX_FILES_PATH=./nginx
POSTGRES_DB=dali
POSTGRES_PASSWORD=password
POSTGRES_USER=foobar
RUN_MIGRATE=false
```

`app.env`:

```
DATABASE_URL=postgres://foobar:password@dali-database:5432/dali
SECRET=secret
VIRTUAL_HOST=localhost
# VIRTUAL_HOST=app.example.com
LETSENCRYPT_EMAIL=example@example.mail.com
LETSENCRYPT_HOST=app.example.com
# LETSENCRYPT_TEST=true
```

# Development

- `$ yarn` installs dependencies
- `$ yarn watch` starts the development server
- `$ yarn watch:test` runs test suite in watch mode
- `$ yarn test` runs the complete test suite
- `$ docker-compose -f docker-compose.yml -f docker-compose.development.yml up -d` prepares services

## How to Update Schema

- `$ yarn graphql:generate` updates schema file

Make sure to commit `data/schema.*` after update.

# [WIP] Deploy

1. `$ yarn release`
1. `$ docker build -t yszk0123/dali-app .`
1. `$ docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d`

# Backup database

- `$ <path/to/repo>/scripts/backup-database <path/to/backup/dir>`

You might need execute the command as root.
