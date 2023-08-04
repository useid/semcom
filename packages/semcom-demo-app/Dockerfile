FROM node:14-alpine

LABEL org.opencontainers.image.source https://github.com/useid/semcom

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
ARG NPM_TOKEN
COPY package.json /usr/src/app/
COPY .npmrc /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

RUN rm -f /usr/src/app/.npmrc
RUN npm run build

# Set node url
ARG NODE_URL=https://node.semcom.digita.ai
RUN /bin/sh -c 'echo "{ \"semcom-node\": \"${NODE_URL}}\" }" > /usr/src/app/dist/assets/config.json'

# Expose ports.
EXPOSE 4200
CMD npm start
