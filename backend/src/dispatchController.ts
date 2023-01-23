import { scrapRoute } from "./scrapper";
import {internalIdToSrId, POSTS} from "./config";
import express from "express";

export async function dispatchController(req: express.Request, res: express.Response) {
    const {post} = req.params;

    if (!internalIdToSrId[post])
        return res.status(400).send({
            "error": "PEBKAC",
            "message": "Server or post is not supported"
        })

    console.log(`${post}`);
    const [data, error] = await scrapRoute(res, internalIdToSrId[post]);
    if (!error && data && Object.values(data).length!== 0)
        return res
            .setHeader("Cache-control", 'public, max-age=86400 stale-if-error=604800 must-revalidate')
            .send(data)
    else {
        console.error("Error: ", error);
        return res.sendStatus(500);
    }
}