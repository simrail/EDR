FROM ghcr.io/project-osrm/osrm-backend:v5.27.1

RUN apt-get update && apt-get upgrade -y
RUN apt-get install wget make osmium-tool docker -y

WORKDIR /opt/host

COPY . /opt/host
RUN make all

EXPOSE 5000

CMD ["make", "serve"]
