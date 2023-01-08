import { simrailClient } from "./simrailClient";
import { BASE_SIMRAIL_API } from "./config";
import express from "express";
import { ApiResponse, Server, Station, Train } from "@simrail/types";

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
    });
}