# WIP Docker file that build the frontend and the desktop app
FROM node:latest AS build
WORKDIR /tmp/frontend
COPY ./frontend /tmp/frontend
RUN npm install --verbose
RUN npm run build

FROM rust:latest as desktop
WORKDIR /tmp/desktop
RUN apt update
RUN apt install -y libwebkit2gtk-4.0-dev \
        build-essential \
        curl \
        wget \
        libssl-dev \
        libgtk-3-dev \
        libayatana-appindicator3-dev \
        librsvg2-dev

RUN apt install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - && apt-get install -y nodejs

COPY ./desktop /tmp/desktop
RUN npm install --verbose
RUN mkdir dist
COPY --from=build /tmp/frontend/build /tmp/desktop/dist
RUN ls -la .
RUN ls -la ./dist
RUN npm run tauri build
RUN ls -la


FROM nginx:stable-alpine AS prod
COPY --from=build /tmp/frontend/build /usr/share/nginx/html
RUN mkdir /usr/share/nginx/html/bin
COPY --from=desktop /tmp/desktop/src-tauri/target/release/bundle /usr/share/nginx/html/bin
RUN ls -la /usr/share/nginx/html/bin
RUN ls -la /usr/share/nginx/html/deb
RUN rm /etc/nginx/conf.d/default.conf
COPY frontend/nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
