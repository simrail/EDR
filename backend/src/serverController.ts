import { simrailClient } from "./simrailClient.js";
import {BASE_AWS_API, BASE_SIMRAIL_API, internalIdToSrId} from "./config.js";
import express from "express";
import { ApiResponse, Server, Station, Train } from "@simrail/types";

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

export function getStationsList(req: express.Request, res: express.Response, serverCode: string) {
    return simrailClient.get("stations-open?serverCode=" + serverCode)?.then((e) => {
        if (e.data.count === 0) {
            const fakedStations = Object.entries(internalIdToSrId).map(([k , n]) => ({Name: n, Prefix: k}));
            return res
                .setHeader("Cache-control", "public, max-age=300")
                .send(fakedStations)
        }
        return res
            .setHeader("Cache-control", 'public, max-age=3600')
            .send((e.data as ApiResponse<Station>).data);
    }).catch(() => {
        return res.sendStatus(500);
    });
}

export function getTrainsList(req: express.Request, res: express.Response, serverCode: string) {
    return simrailClient.get("trains-open?serverCode=" + serverCode)?.then((e) => {
        return res
            .setHeader("Cache-control", 'public, max-age=10, must-revalidate, stale-if-error=30')
            .send((e.data as ApiResponse<Train>).data);
    }).catch(() => {
        return res.sendStatus(500);
    });
}

export function getServerTz(req: express.Request, res: express.Response) {
    return simrailClient.get("getTimeZone?serverCode=" + req.params['serverCode'], BASE_AWS_API)?.then((e) => {
        return res
            .setHeader("Cache-control", 'public, max-age=3060, must-revalidate')
            .send(`${e.data}`);
    }).catch(() => {
        return res.sendStatus(500);
    });
}

export function getPlayer(req: express.Request, res: express.Response) {
    return simrailClient.get(`users-open/${req.params['steamId']}`)?.then((e) => {
        return res
            .setHeader("Cache-control", 'public, max-age=3060, must-revalidate')
            .send(e.data);
    }).catch(() => {
        return res.sendStatus(500);
    });
}