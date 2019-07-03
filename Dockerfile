FROM keymetrics/pm2:latest-alpine
LABEL maintainer="Maxime Signoret"

WORKDIR /usr/app

RUN mkdir data/

VOLUME data/

COPY src src/
COPY public public/
COPY package.json .
COPY pm2.json .

ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

CMD [ "pm2-runtime", "start", "pm2.json" ]
