import {Server, Station, Train} from "@simrail/types";
import { subHours } from "date-fns";
import { ISteamUser } from "../config/ISteamUser";
import { TrainTimeTableRow } from "../Sirius";
import { TimeTableRow } from "../customTypes/TimeTableRow";
import { ExtendedTrain } from "../customTypes/ExtendedTrain";

export const BASE_API_URL = "https://example.com/";

const baseApiCall = (URL: string) => {
    // TODO: Add error toast
    const outbound = BASE_API_URL + URL;
    // console_log("Outbound URL: ", outbound)
    return fetch(outbound).then(res => res.json());
}

export const getTimetable = (post: string, serverCode: string): Promise<TimeTableRow[]> =>
    baseApiCall(`dispatch/${serverCode}/${post}?mergePosts=true`).then((data: TimeTableRow[]) => data.map(tr => {
        tr.actualArrivalObject = subHours(new Date(tr.actualArrivalObject), (new Date().getTimezoneOffset() * -1) / 60);
        tr.actualDepartureObject = subHours(new Date(tr.actualDepartureObject), (new Date().getTimezoneOffset() * -1) / 60);
        tr.scheduledArrivalObject = subHours(new Date(tr.scheduledArrivalObject), (new Date().getTimezoneOffset() * -1) / 60);
        tr.scheduledDepartureObject = subHours(new Date(tr.scheduledDepartureObject), (new Date().getTimezoneOffset() * -1) / 60);

        return tr;
    }));

export const getTrainTimetable = (trainId: string, serverCode: string): Promise<TrainTimeTableRow[]> =>
    baseApiCall(`train/${serverCode}/${trainId}`).then((data: TrainTimeTableRow[]) => data.map(tr => {
        tr.actualArrivalObject = subHours(new Date(tr.actualArrivalObject), (new Date().getTimezoneOffset() * -1) / 60);
        tr.actualDepartureObject = subHours(new Date(tr.actualDepartureObject), (new Date().getTimezoneOffset() * -1) / 60);
        tr.scheduledArrivalObject = subHours(new Date(tr.scheduledArrivalObject), (new Date().getTimezoneOffset() * -1) / 60);
        tr.scheduledDepartureObject = subHours(new Date(tr.scheduledDepartureObject), (new Date().getTimezoneOffset() * -1) / 60);

        return tr;
    }));

export const getTrains = (serverCode: string): Promise<Train[]> =>
    baseApiCall(`trains/${serverCode}`);

export const getTrainsForPost = (serverCode: string, post: string): Promise<ExtendedTrain[]> =>
    baseApiCall(`trains/${serverCode}/${post}`);

export const getStations = (serverCode: string): Promise<Station[]> =>
    baseApiCall(`stations/${serverCode}`);

export const getServers = (): Promise<Server[]> =>
    baseApiCall("servers");

export const getPlayer = (steamId: string): Promise<ISteamUser> =>
    baseApiCall(`steam/${steamId}`);

export const getTzOffset = (serverCode: string): Promise<number> =>
    baseApiCall(`server/tz/${serverCode}`);

export const getServerTime = (serverCode: string): Promise<number> =>
    baseApiCall(`server/time/${serverCode}`);
