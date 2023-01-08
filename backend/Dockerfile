FROM node:current-alpine3.16
WORKDIR /usr/api
COPY . .
RUN npm install --verbose
RUN npm run build
CMD ["npm", "run", "prod-start"]
