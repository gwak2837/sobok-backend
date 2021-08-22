# Install all packages and transpile TypeScript into JavaScript
FROM node:lts-alpine AS node-builder

WORKDIR /server

COPY .yarn .yarn
COPY src src
COPY .yarnrc.yml package.json tsconfig.json yarn.lock ./

RUN yarn && yarn build

# Install only dependency packages
FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /server

COPY --from=node-builder /server/dist dist
COPY .yarn/plugins .yarn/plugins
COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml package.json yarn.lock ./

RUN yarn workspaces focus --production
RUN apk add redis

EXPOSE $PORT

ENTRYPOINT [ "yarn" ]

CMD [ "concurrently", "\"/usr/bin/redis-server --bind 'localhost'\"", "\"yarn start\""]