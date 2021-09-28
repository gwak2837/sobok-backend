# Install all packages and transpile TypeScript into JavaScript
FROM node:16-alpine AS node-builder

WORKDIR /server

COPY .yarn .yarn
COPY src src
COPY .yarnrc.yml package.json tsconfig.json yarn.lock ./

RUN yarn && yarn build

# Install only dependency packages
FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /server

COPY .yarn/plugins .yarn/plugins
COPY .yarn/releases .yarn/releases
COPY .yarnrc.yml package.json yarn.lock ./
COPY --from=node-builder /server/dist dist

RUN yarn workspaces focus --production

EXPOSE $PORT


ENTRYPOINT [ "yarn" ]

CMD [ "start"]