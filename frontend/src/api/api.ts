import {Server, Station, Train} from "@simrail/types";
import { TimeTableRow } from "../EDR";
import { TrainTimeTableRow } from "../Sirius";

export const BASE_API_URL = "https://dispatch-api.cdn.infra.deadlykungfu.ninja/"

// For a smooth transition, all 1.3 will go to staging env. 1.2 will stay in prod
// This will avoid disruptiong for current users despite API changes
const baseApiCall = (URL: string) => {
    // TODO: Add error toast
    const outbound = BASE_API_URL + URL;
    // console_log("Outbound URL: ", outbound)
    return fetch(outbound).then(res => res.json());
}

export const getTimetable = (post: string): Promise<TimeTableRow[]> =>
    baseApiCall("dispatch/" + post + "?mergePosts=true");

export const getTrainTimetable = (trainId: string): Promise<TrainTimeTableRow[]> =>
    fetch(BASE_API_URL + "train/" + trainId).then((r) => r.json());

export const getTrainTimetableList = (trainIdList: string[]): Promise<TrainTimeTableRow[][]> =>
    fetch(BASE_API_URL + "train/batch", {
        method: "POST",
        body: JSON.stringify({trainNoList: trainIdList }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((r) => r.json());

export const getTrains = (server: string): Promise<Train[]> =>
    baseApiCall( "trains/" + server);

export const getStations = (server: string): Promise<Station[]> =>
    baseApiCall("stations/" + server);

export const getServers = (): Promise<Server[]> =>
    baseApiCall("servers");

export const getPlayer = (steamId: string): Promise<any> =>
    baseApiCall("steam/" + steamId);

export const getTzOffset = (serverId: string): Promise<any> =>
    baseApiCall("server/tz/" + serverId);
