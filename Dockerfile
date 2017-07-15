# # It's a little laborious to install watchman on Linux.
# # cf. https://github.com/facebook/relay/pull/1966
# FROM node:8-alpine AS build
# WORKDIR /app
# COPY package.json yarn.lock /app/
# RUN yarn
# COPY data /app/data
# COPY . /app/
# RUN yarn build

FROM node:8-alpine
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn --production
# COPY --from build /app /app
COPY . /app
CMD yarn start:with-migrate
