// const BASE_API_URL = "http://localhost:8080/";
import {ApiResponse, Server, Station, Train} from "@simrail/types";

const BASE_API_URL = "https://dispatch-api.cdn.infra.deadlykungfu.ninja/"
const NGINX_DIRECT = "https://dispatch-api.nginx.infra.deadlykungfu.ninja:8080/"
const baseApiCall = (URL: string, noCDN: boolean = false) => {
    // TODO: Add error toast
    const outbound = (noCDN ? NGINX_DIRECT : BASE_API_URL) + URL;
    console.log("Outbound URL: ", outbound)
    return fetch(outbound, {
        headers: new Headers({
            "x-debug": new URLSearchParams(window.location.search).get("betaToken") ?? "No token"
        })
    })
        .then(res => res.json())
}

export const api = (server: string, post: string, noCDN: boolean = false): Promise<any> =>
    baseApiCall("dispatch/" + server + "/" + post, noCDN);

export const getTrains = (server: string, noCDN: boolean = false): Promise<ApiResponse<Train>> =>
    baseApiCall( "trains/" + server, noCDN);

export const getStations = (server: string, noCDN: boolean = false): Promise<ApiResponse<Station>> =>
    baseApiCall("stations/" + server, noCDN);

export const getServers = (noCDN: boolean = false): Promise<ApiResponse<Server>> =>
    baseApiCall("servers", noCDN);