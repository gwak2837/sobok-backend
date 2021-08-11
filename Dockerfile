FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /server

# Install all packages
COPY package.json yarn.lock ./
RUN yarn install --production=false

# Transpile TypeScript into JavaScript
COPY src src
COPY tsconfig.json ./
RUN yarn build

# Remove useless files
RUN rm -rf node_modules src tsconfig.json

# Install only dependency packages 
RUN yarn install --production=true

EXPOSE $PORT

ENTRYPOINT [ "yarn" ]

CMD [ "start" ]
