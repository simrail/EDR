import { selfClient, simkolClient, simrailClient, strictAwsSimrailClient } from "./simrailClient.js";
import {BASE_AWS_API, BASE_SIMRAIL_API, POSTS, stationPositions} from "./config.js";
import express from "express";
import { ApiResponse, Server, Station, Train } from "@simrail/types";
import { ISteamUser } from "./interfaces/ISteamUser.js";
import axios from "axios";
import { IRouteData } from "./interfaces/IRouteData.js";
import { IEdrServerTrain } from "./interfaces/IEdrServerTrain.js";

// For every server we store the number of seconds since the last update & the current time on that server
const timeList: {[x: string]: [number, number]} = {};
setInterval(() => {
    Object.keys(timeList).map(key => {
        // Increment seconds since last update from API
        timeList[key][0] = timeList[key][0] + 1;
        // Increment time on server by 1 second
        timeList[key][1] = timeList[key][1] + 1000;
    });
}, 1000);

export async function getServerCodeList() {
    const response = await simrailClient.get("servers-open", BASE_SIMRAIL_API);
    return (response.data as ApiResponse<Server>).data?.map(server => server.ServerCode);
}

export function getServerList(req: express.Request, res: express.Response) {
    return simrailClient.get("servers-open", BASE_SIMRAIL_API)?.then((e) => {
        const serverData = (e.data as ApiResponse<Server>).data;
        // Sort by Language code so the client doesn't have to
        serverData.sort((s1, s2) => s1.ServerCode.slice(0, 2).toUpperCase() < s2.ServerCode.slice(0, 2).toUpperCase() ? -1 : 0);
        // Sort by server number
        serverData.sort((s1, s2) => s1.ServerCode.slice(0, 2).toUpperCase() === s2.ServerCode.slice(0, 2).toUpperCase() && s1.ServerCode.slice(2) < s2.ServerCode.slice(2) ? -1 : 0);
        return res
            .setHeader("Cache-control", 'public, max-age=60, stale-if-error=3060')
            .send(serverData);
    }).catch(() => {
        return res.sendStatus(500);
    });
}

export function getStationsList(req: express.Request, res: express.Response) {
    return simrailClient.get("stations-open?serverCode=" + req.params.serverCode)?.then((e) => {
        return res
            .setHeader("Cache-control", 'public, max-age=60')
            .send((e.data as ApiResponse<Station>).data);
    }).catch(() => {
        return res.sendStatus(500);
    });
}

export function getTrainsList(req: express.Request, res: express.Response) {
    return simrailClient.get(`trains-open?serverCode=${req.params.serverCode}`)?.then((e) => {
        return res
            .setHeader("Cache-control", 'public, max-age=10, must-revalidate, stale-if-error=30')
            .send((e.data as ApiResponse<Train>).data);
    }).catch(() => {
        return res.sendStatus(500);
    });
}

export async function getTrainsListForPost(req: express.Request, res: express.Response, trainTimetables: IEdrServerTrain[]) {
    try {
        const { serverCode, post } = req.params;
        const e = await selfClient.get(`trains/${serverCode}`);
        const trainList = (e.data as Train[]);
        return res
            .setHeader("Cache-control", 'public, max-age=10, must-revalidate, stale-if-error=30')
            .send(await Promise.all(trainList.map(async (train) => {
                let osrmResult: IRouteData = {} as IRouteData;
                const trainTimetable = trainTimetables.find(timetable => timetable.trainNoLocal === train.TrainNoLocal);
                if (trainTimetable !== undefined) {
                    // TODO: This needs refactoring when new stations get lumped together like Glowny
                    const internalIds = POSTS[post];
                    const postsInTimetable = trainTimetable.timetable.filter(checkpoint => internalIds.includes(parseInt(checkpoint.pointId)));
                    const hasTrainLeftThePost = postsInTimetable !== undefined && postsInTimetable.length > 0 ? train?.TrainData.VDDelayedTimetableIndex > postsInTimetable[postsInTimetable.length - 1].indexOfPoint : true;
                    if (train.TrainNoLocal === "40131") console.log(`Train: ${train.TrainNoLocal}, postId: ${internalIds}, checkpointIndex: ${postsInTimetable?.[0]?.indexOfPoint}, trainLeft: ${hasTrainLeftThePost}`);
                    if (hasTrainLeftThePost) {
                        return {
                            ...train,
                            distanceFromStation: null,
                        };
                    } else {
                        const stationPosition = stationPositions[internalIds[0]];
                        osrmResult = (await getOsrmDataFromSelfApi(train.TrainData.Longitute, train.TrainData.Latititute, stationPosition[0], stationPosition[1])).data;
                        if (train.TrainNoLocal === "40131") console.log(`OSRM for train ${train.TrainNoLocal}: Distance: ${osrmResult.routes[0].distance}, ETA: ${osrmResult.routes[0].duration}`);
                        return {
                            ...train,
                            distanceFromStation: osrmResult?.routes?.[0]?.distance !== undefined ? Math.round(osrmResult.routes[0].distance / 10) / 100 : 0,
                        };
                    }
                } else {
                    return {
                        ...train,
                        distanceFromStation: null,
                    };
                }
                
            })).catch(reason => console.log(reason)));
    } catch {
        return res.sendStatus(500);
    }
}

export function getServerTz(req: express.Request, res: express.Response) {
    return simrailClient.get(`getTimeZone?serverCode=${req.params['serverCode']}`, BASE_AWS_API)?.then((e) => {
        return res
            .setHeader("Cache-control", 'public, max-age=3060, must-revalidate')
            .send(`${e.data}`);
    }).catch(() => {
        return res.sendStatus(500);
    });
}

export function getServerTime(req: express.Request, res: express.Response) {
    const { serverCode } = req.params;
    const cachedTimeData = timeList[serverCode];
    if (cachedTimeData === undefined || cachedTimeData[0] >= 120) {
        return simrailClient.get(`gettime?serverCode=${req.params['serverCode']}`, BASE_AWS_API)?.then((e) => {
            if (timeList[serverCode] === undefined) {
                timeList[serverCode] = [0, 0];
            }

            timeList[serverCode][0] = 0;
            timeList[serverCode][1] = e.data;
            return res
                .setHeader("Cache-control", 'public, max-age=1, must-revalidate')
                .send(`${e.data}`);
        }).catch(() => {
            return res.sendStatus(500);
        });
    } else {
        return res
            .setHeader("Cache-control", 'public, max-age=1, must-revalidate')
            .send(`${cachedTimeData[1]}`);
    }
}

const STEAM_API_KEY = process.env.STEAM_API_KEY;

export function getPlayer(req: express.Request, res: express.Response) {
    if (!STEAM_API_KEY) {
        console.error("No steam API key, unable to fetch steam profile!");
        return res.sendStatus(500);
    }

    return axios
    .get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&format=json&steamids=${req.params.steamId}`)
    .then((response) => {
        if (response.status === 200) {
            return res
                .setHeader("Cache-control", 'public, max-age=86400')
                .send(response.data.response.players?.[0] as ISteamUser);
        } else {
            return res.sendStatus(500);
        }
    }).catch(() => {
        return res.sendStatus(500);
    });
}

// This endpoint has a very heavy rate limit (Absolute max. of 1 req./30s/server, ideally 1 req./min), hence the strict client
export function getFullTimetable(serverCode: string) {
    return strictAwsSimrailClient.get("getAllTimetables?serverCode=" + serverCode);
}

// This endpoint has a very heavy rate limit (Absolute max. of 1 req./30s/server, ideally 1 req./min), hence the strict client
export function getEdrTimetable(serverCode: string) {
    return strictAwsSimrailClient.get("getEDRTimetables?serverCode=" + serverCode);
}

export function getSpeedLimitsFromSimkol() {
    return simkolClient.get("speeds.json");
}

export function getOsrmDataFromSelfApi(startLon: number, startLat: number, endLon: number, endLat: number) {
    return selfClient.get(`route/v1/train/${Math.round(startLon * 100000) / 100000},${Math.round(startLat * 100000) / 100000};${Math.round(endLon * 100000) / 100000},${Math.round(endLat * 100000) / 100000}?overview=false&continue_straight=true`);
}
