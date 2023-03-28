import {Server, Station, Train} from "@simrail/types";
import { subHours } from "date-fns";
import { ISteamUser } from "../config/ISteamUser";
import { TimeTableRow } from "../EDR";
import { TrainTimeTableRow } from "../Sirius";

export const BASE_API_URL = "http://example.com/";

const baseApiCall = (URL: string) => {
    // TODO: Add error toast
    const outbound = BASE_API_URL + URL;
    // console_log("Outbound URL: ", outbound)
    return fetch(outbound).then(res => res.json());
}

export const getTimetable = (post: string): Promise<TimeTableRow[]> =>
    baseApiCall("dispatch/" + post + "?mergePosts=true").then((data: TimeTableRow[]) => data.map(tr => {
        tr.arrivalTimeObject = subHours(new Date(tr.arrivalTimeObject), (new Date().getTimezoneOffset() * -1) / 60);
        tr.departureTimeObject = subHours(new Date(tr.departureTimeObject), (new Date().getTimezoneOffset() * -1) / 60);

        return tr;
    }));

export const getTrainTimetable = (trainId: string): Promise<TrainTimeTableRow[]> =>
    fetch(BASE_API_URL + "train/" + trainId).then((r) => r.json());

export const getTrains = (server: string): Promise<Train[]> =>
    baseApiCall( "trains/" + server);

export const getStations = (server: string): Promise<Station[]> =>
    baseApiCall("stations/" + server);

export const getServers = (): Promise<Server[]> =>
    baseApiCall("servers");

export const getPlayer = (steamId: string): Promise<ISteamUser> =>
    baseApiCall("steam/" + steamId);

export const getTzOffset = (serverId: string): Promise<any> =>
    baseApiCall("server/tz/" + serverId);
