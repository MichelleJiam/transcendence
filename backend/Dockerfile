# FROM node:lts-alpine3.14
FROM node:latest

USER node
WORKDIR /app
RUN chown node:node ./
CMD npm ci && npm run start:dev
