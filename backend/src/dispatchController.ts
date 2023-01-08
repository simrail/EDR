import { scrapRoute } from "./scrapper";
import { POSTS, SERVERS } from "./config";
import express from "express";

export async function dispatchController(req: express.Request, res: express.Response) {
    const {serverCode, post} = req.params;

    if (!SERVERS.includes(serverCode) || !POSTS[post])
        return res.status(400).send({
            "error": "PEBKAC",
            "message": "Server or post is not supported"
        })

    console.log(`${serverCode} ${post}`);
    // TODO: Check if the post is a valid value
    const [data, error] = await scrapRoute(res, serverCode, post);
    if (!error)
        res
            .setHeader("Cache-control", 'public, max-age=3600')
            .send(data)
}