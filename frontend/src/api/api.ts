import {Server, Station, Train} from "@simrail/types";
import { subHours } from "date-fns";
import { ISteamUser } from "../config/ISteamUser";
import { TrainTimeTableRow } from "../Sirius";
import { TimeTableRow } from "../customTypes/TimeTableRow";
import { ExtendedTrain } from "../customTypes/ExtendedTrain";
import { configByLoco } from "../config/trains"

export const BASE_API_URL = process.env.PUBLIC_URL || "http://127.0.0.1:8080/";

const baseApiCall = async (URL: string) => {
    // TODO: Add error toast
    const outbound = BASE_API_URL + URL;
    // console_log("Outbound URL: ", outbound)
    const result = await fetch(outbound)
    if (result.ok) {
        return result.json()
    }
    throw new Error(`Failed to fetch ${outbound}, got status code ${result.status}`)
}

export const getTimetable = (post: string, serverCode: string): Promise<TimeTableRow[]> =>
    baseApiCall(`dispatch/${serverCode}/${post}?mergePosts=true`).then((data: TimeTableRow[]) => data.map(tr => {
        tr.actualArrivalObject = subHours(new Date(tr.actualArrivalObject), (new Date(tr.actualArrivalObject).getTimezoneOffset() * -1) / 60);
        tr.actualDepartureObject = subHours(new Date(tr.actualDepartureObject), (new Date(tr.actualDepartureObject).getTimezoneOffset() * -1) / 60);
        tr.scheduledArrivalObject = subHours(new Date(tr.scheduledArrivalObject), (new Date(tr.scheduledArrivalObject).getTimezoneOffset() * -1) / 60);
        tr.scheduledDepartureObject = subHours(new Date(tr.scheduledDepartureObject), (new Date(tr.scheduledDepartureObject).getTimezoneOffset() * -1) / 60);

        return tr;
    }));

export const getTrainTimetable = (trainId: string, serverCode: string): Promise<TrainTimeTableRow[]> =>
    baseApiCall(`train/${serverCode}/${trainId}`).then((data: TrainTimeTableRow[]) => data.map(tr => {
        tr.actualArrivalObject = subHours(new Date(tr.actualArrivalObject), (new Date(tr.actualArrivalObject).getTimezoneOffset() * -1) / 60);
        tr.actualDepartureObject = subHours(new Date(tr.actualDepartureObject), (new Date(tr.actualDepartureObject).getTimezoneOffset() * -1) / 60);
        tr.scheduledArrivalObject = subHours(new Date(tr.scheduledArrivalObject), (new Date(tr.scheduledArrivalObject).getTimezoneOffset() * -1) / 60);
        tr.scheduledDepartureObject = subHours(new Date(tr.scheduledDepartureObject), (new Date(tr.scheduledDepartureObject).getTimezoneOffset() * -1) / 60);

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

export const getPlayer = async (steamId: string): Promise<ISteamUser> => {
    try {
        return await baseApiCall(`steam/${steamId}`);
    } catch {
        return {
            steamid: steamId,
            communityvisibilitystate: 1,
            profilestate: 1,
            personaname: 'NoSteamApiKeyGuy',
            profileurl: 'https://example.com',
            avatar: configByLoco["4E/EU07-096"].icon,
            avatarfull: configByLoco["4E/EU07-096"].icon,
            avatarmedium: configByLoco["4E/EU07-096"].icon
        }
    }
}

export const getTzOffset = (serverCode: string): Promise<number> =>
    baseApiCall(`server/tz/${serverCode}`);

export const getServerTime = (serverCode: string): Promise<number> => 
    baseApiCall(`server/time/${serverCode}`);
