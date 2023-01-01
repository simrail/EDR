// const BASE_API_URL = "http://localhost:8080/";
const BASE_API_URL = "https://dispatch-api.cdn.infra.deadlykungfu.ninja/"

export const getTimetable = (server: string, post: string) =>
    fetch(BASE_API_URL + "dispatch/" + server + "/" + post).then(res => res.json());

export const getTrains = (server: string) =>
    fetch(BASE_API_URL + "trains/" + server).then(res => res.json());

export const getStations = (server: string) =>
    fetch(BASE_API_URL + "stations/" + server).then(res => res.json());

export const getServers = () =>
    fetch(BASE_API_URL + "servers").then(res => res.json());