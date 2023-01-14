import { simrailClient } from "./simrailClient";
import { BASE_SIMRAIL_API } from "./config";
import express from "express";
import { ApiResponse, Server, Station, Train } from "@simrail/types";
import axios from "axios";

export function getServerList(req: express.Request, res: express.Response) {
    return simrailClient.get("servers-open", BASE_SIMRAIL_API)?.then((e) => {
        return res
            .setHeader("Cache-control", 'public, max-age=3600')
            .send((e.data as ApiResponse<Server>).data);
    });
};

export function getStationsList(req: express.Request, res: express.Response, serverCode: string) {
    return simrailClient.get("stations-open?serverCode=" + serverCode)?.then((e) => {
        return res
            .setHeader("Cache-control", 'public, max-age=3600')
            .send((e.data as ApiResponse<Station>).data);
    });
}

export function getTrainsList(req: express.Request, res: express.Response, serverCode: string) {
    return simrailClient.get("trains-open?serverCode=" + serverCode)?.then((e) => {
        /*if (e.data.lenght === 0) {
            return res.sendStatus(500);
        }*/
        return res
            .setHeader("Cache-control", 'public, max-age=10, must-revalidate, stale-if-error=30')
            .send((e.data as ApiResponse<Train>).data);
    }).catch(() => {
        return res.sendStatus(500);
    })
}

export function getPlayer(req: express.Request, res: express.Response, steamId: string) {
    return axios
        .get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=80B65382D84C9D2A9BB94FC9741083B9&format=json&steamids=${steamId}`)
        .then((response) => {
            if (response.status === 200) {
                return res
                    .setHeader("Cache-control", 'public, max-age=3600')
                    .send(response.data.response.players.map((sr: any) => ({avatar: sr.avatar, pseudo: sr.personaname})))
            }
            else
                return res.sendStatus(500)
        });

}