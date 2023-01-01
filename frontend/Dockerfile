FROM node:latest AS build
WORKDIR /tmp/frontend
COPY . /tmp/frontend
RUN npm install --verbose
RUN npm run build

FROM nginx:stable-alpine AS prod
COPY --from=build /tmp/frontend/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
