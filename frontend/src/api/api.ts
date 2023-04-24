import {Server, Station, Train} from "@simrail/types";
import { subHours } from "date-fns";
import { ISteamUser } from "../config/ISteamUser";
import { TrainTimeTableRow } from "../Sirius";
import { TimeTableRow } from "../customTypes/TimeTableRow";

export const BASE_API_URL = "http://example.com/";

const baseApiCall = (URL: string) => {
    // TODO: Add error toast
    const outbound = BASE_API_URL + URL;
    // console_log("Outbound URL: ", outbound)
    return fetch(outbound).then(res => res.json());
}

export const getTimetable = (post: string): Promise<TimeTableRow[]> =>
    baseApiCall("dispatch/" + post + "?mergePosts=true").then((data: TimeTableRow[]) => data.map(tr => {
        tr.scheduledArrivalObject = subHours(new Date(tr.scheduledArrivalObject), (new Date().getTimezoneOffset() * -1) / 60);
        tr.scheduledDepartureObject = subHours(new Date(tr.scheduledDepartureObject), (new Date().getTimezoneOffset() * -1) / 60);

        return tr;
    }));

export const getTrainTimetable = (trainId: string): Promise<TrainTimeTableRow[]> =>
    baseApiCall("train/" + trainId).then((data: TrainTimeTableRow[]) => data.map(tr => {
        tr.scheduledArrivalObject = subHours(new Date(tr.scheduledArrivalObject), (new Date().getTimezoneOffset() * -1) / 60);
        tr.scheduledDepartureObject = subHours(new Date(tr.scheduledDepartureObject), (new Date().getTimezoneOffset() * -1) / 60);

        return tr;
    }));

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
