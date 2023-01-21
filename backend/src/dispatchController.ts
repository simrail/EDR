import { scrapRoute } from "./scrapper";
import {internalIdToSrId, POSTS} from "./config";
import express from "express";

export async function dispatchController(req: express.Request, res: express.Response) {
    const {serverCode, post} = req.params;

    if (!internalIdToSrId[post])
        return res.status(400).send({
            "error": "PEBKAC",
            "message": "Server or post is not supported"
        })

    console.log(`${serverCode} ${post}`);
    // TODO: Check if the post is a valid value
    const [data, error] = await scrapRoute(res, serverCode, internalIdToSrId[post]);
    if (!error && data && Object.values(data).length!== 0)
        return res
            .setHeader("Cache-control", 'public, max-age=3600 must-revalidate')
            .send(data)
    else {
        console.error("Error: ", error);
        return res.sendStatus(500);
    }
}