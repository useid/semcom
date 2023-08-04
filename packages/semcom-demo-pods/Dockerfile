FROM node:14-alpine

LABEL org.opencontainers.image.source https://github.com/useid/semcom

ENV BASE_URL=http://localhost
ENV PORT=9000
ENV CONFIG=config/config-file.json

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
ARG NPM_TOKEN
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Copy initial data
COPY data/tiapieters/ /tmp/css/tiapieters/
COPY data/tonypaillard/ /tmp/css/tonypaillard/

# Expose ports.
EXPOSE 9000
CMD ./node_modules/.bin/community-solid-server -b ${BASE_URL} -p ${PORT} -c ${CONFIG} --rootFilePath /tmp/css
