FROM node:latest AS build
WORKDIR /tmp/frontend
COPY .. /tmp/frontend
RUN npm install
RUN npm run build
FROM nginx:latest AS prod
