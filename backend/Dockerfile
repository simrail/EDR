FROM node:current-alpine3.16
WORKDIR /usr/api
COPY . .
RUN npm ci
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "prod-start"]
