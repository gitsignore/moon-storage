FROM node:10-alpine

RUN apk update && apk upgrade && apk add --no-cache bash git openssh

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

COPY package*.json ./
RUN npm install --quiet && npm cache clean --force

COPY . .
