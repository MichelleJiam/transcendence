# FROM node:lts-alpine3.14
FROM node:latest

USER node
WORKDIR /app
RUN chown node:node ./
ENV NODE_OPTIONS=--max_old_space_size=4096
CMD npm install && npm run start:dev
