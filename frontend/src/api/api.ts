// const BASE_API_URL = "http://localhost:8080/";
import {ApiResponse, Server, Station, Train} from "@simrail/types";

export const BASE_API_URL = "https://dispatch-api.cdn.infra.deadlykungfu.ninja/"
export const NGINX_DIRECT = "https://dispatch-api.nginx.infra.deadlykungfu.ninja:8080/"
// export const BASE_API_URL = "http://localhost:8080/"
const baseApiCall = (URL: string, noCDN: boolean = false) => {
    // TODO: Add error toast
    const outbound = (noCDN ? NGINX_DIRECT : BASE_API_URL) + URL;
    // console_log("Outbound URL: ", outbound)
    return fetch(outbound, {
        headers: new Headers({
            "x-debug": new URLSearchParams(window.location.search).get("betaToken") ?? "No token"
        })
    })
        .then(res => res.json())
}

export const getTimetable = (server: string, post: string): Promise<any> =>
    baseApiCall("dispatch/" + server + "/" + post);

export const getTrains = (server: string): Promise<ApiResponse<Train>> =>
    baseApiCall( "trains/" + server);

export const getStations = (server: string): Promise<ApiResponse<Station>> =>
    baseApiCall("stations/" + server);

export const getServers = (): Promise<ApiResponse<Server>> =>
    baseApiCall("servers");

export const getPlayer = (steamId: string): Promise<any> =>
    baseApiCall("steam/" + steamId);