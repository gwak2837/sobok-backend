# Install only dependency packages
FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /server

COPY package.json tsconfig.json yarn.lock ./
COPY src src

RUN yarn install --production=false && \
    yarn build && \
    rm -r node_modules && \
    yarn install --production=true && \
    yarn add concurrently --global && \
    yarn cache clean && \
    rm tsconfig.json yarn.lock && \
    rm -r src && \
    apk add redis

EXPOSE $PORT

ENTRYPOINT [ "yarn" ]

CMD [ "concurrently", "\"/usr/bin/redis-server --bind 'localhost'\"", "\"yarn start\""]