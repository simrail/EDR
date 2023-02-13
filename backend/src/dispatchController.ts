import { scrapRoute } from "./scrapper";
import {internalIdToSrId, newInternalIdToSrId, POSTS} from "./config";
import express from "express";
import {getStationTimetable} from "./sql/stations";
import {getTrainTimetable} from "./sql/train";

export async function dispatchController(req: express.Request, res: express.Response) {
    const {post} = req.params;

    if (!internalIdToSrId[post])
        return res.status(400).send({
            "error": "PEBKAC",
            "message": "Server or post is not supported"
        })

    console.log(`${post}`);
    try {
        const data = await getStationTimetable(newInternalIdToSrId[post]);
        return res.send(data)
            .setHeader("Cache-control", 'public, max-age=86400 stale-if-error=604800 must-revalidate')
        /*if (!error && data && Object.values(data).length !== 0)
            return res
                .setHeader("Cache-control", 'public, max-age=86400 stale-if-error=604800 must-revalidate')
                .send(data)
        else {
            console.error("Error: ", error);
            return res.sendStatus(500);
        }*/
    } catch (e) {
        console.error("Internal server error on dispatch timetable ", e);
        return res.sendStatus(500);
    }
}

export async function trainTimetableController(req: express.Request, res: express.Response) {
    const {trainNo} = req.params;

    try {
        const data = await getTrainTimetable(trainNo);
        res.send(data)
            .setHeader("Cache-control", 'public, max-age=86400 stale-if-error=604800 must-revalidate')
    } catch (e) {
        console.error("Internal server error on train timetable ", e);
        return res.sendStatus(500);
    }
}
