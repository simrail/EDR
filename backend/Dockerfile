FROM node:current-alpine3.21
WORKDIR /usr/api
COPY . .
RUN npm ci
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "prod-start"]
