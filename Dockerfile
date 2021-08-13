# Install all packages and transpile TypeScript into JavaScript
FROM node:lts-alpine AS node-builder

WORKDIR /server

COPY package.json tsconfig.json yarn.lock ./
COPY src src

RUN yarn install --production=false &&\
    yarn build

# Install only dependency packages
FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /server

COPY --from=node-builder /server/dist dist
COPY package.json yarn.lock ./

RUN yarn install --production=true &&\
    yarn add concurrently --global &&\
    yarn cache clean &&\
    rm yarn.lock &&\
    apk add redis

EXPOSE $PORT

ENTRYPOINT [ "yarn" ]

CMD [ "concurrently", "\"/usr/bin/redis-server --bind 'localhost'\"", "\"yarn start\""]