FROM node:10-alpine

RUN apk update && apk upgrade && apk add --no-cache bash git openssh

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/api && cp -a /tmp/node_modules /usr/src/api

WORKDIR /usr/src/api

ADD . /usr/src/api/
