import { simkolClient, simrailClient, strictAwsSimrailClient } from "./simrailClient.js";
import {BASE_AWS_API, BASE_SIMRAIL_API} from "./config.js";
import express from "express";
import { ApiResponse, Server, Station, Train } from "@simrail/types";
import { ISteamUser } from "./interfaces/ISteamUser.js";
import axios from "axios";

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
    return simrailClient.get("trains-open?serverCode=" + req.params.serverCode)?.then((e) => {
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
    return strictAwsSimrailClient.get("getEDRTimetables?serverCode=" + serverCode);
}

export function getSpeedLimitsFromSimkol() {
    return simkolClient.get("speeds.json");
}
