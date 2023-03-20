import {internalIdToSrId, newInternalIdToSrId, POSTS} from "./config.js";
import express from "express";
import {getStationTimetable} from "./dataTransformer/stations.js";
import {getTrainTimetable} from "./dataTransformer/train.js";
import _ from "lodash";
import { IFrontendStationTrainRow } from "./interfaces/IFrontendStationTrainRow.js";

const mergePostRows = (allPostsResponse: IFrontendStationTrainRow[][]) => {
    const primaryPostRows = allPostsResponse[0];
    const secondaryPostsRows = allPostsResponse.slice(1);

    const keyedSecondaryPostsRows = secondaryPostsRows.map((secondaryPostRows) => _.keyBy(secondaryPostRows, 'train_number'));

    // Handle stations that have multiple posts, merge their data into a single entry
    const mergedPostsRows = primaryPostRows.reduce((acc, v) => [
        ...acc,
        {
            ...v,
            secondaryPostsRows: keyedSecondaryPostsRows.map((kspr) => kspr[v.train_number])
        }
    ], new Array<IFrontendStationTrainRow>());

    const keyedFirstPostTrains = _.keyBy(primaryPostRows, 'train_number');

    // TODO: This has state, temporary fix
    secondaryPostsRows.map((secondary_post_trains) => {
        for (const train of secondary_post_trains) {
            if (!keyedFirstPostTrains[train.train_number]) {
                mergedPostsRows.push(train);
            }
        }
    });

    return _.sortBy(mergedPostsRows, 'arrival_time_object');
}

export async function dispatchController(req: express.Request, res: express.Response) {
    const { post } = req.params;

    if (!internalIdToSrId[post])
        return res.status(400).send({
            "error": "PEBKAC",
            "message": "Server or post is not supported"
        });

    try {
        const mergePosts = req.query.mergePosts === "true";
        const postsToFetch = mergePosts ? POSTS[post] : [newInternalIdToSrId[post]];
        const data = await Promise.all(postsToFetch.map(getStationTimetable));
        const mergedPosts = mergePostRows(data);
        return res
            .setHeader("Cache-control", 'public, max-age=28800 stale-if-error=604800 must-revalidate')
            .send(mergedPosts);
    } catch (e) {
        console.error("Internal server error on dispatch timetable ", e);
        return res.sendStatus(500);
    }
}

export async function trainTimetableController(req: express.Request, res: express.Response) {
    const {trainNo} = req.params;

    try {
        const data = await getTrainTimetable(trainNo);
        res
            .setHeader("Cache-control", 'public, max-age=28800 stale-if-error=604800 must-revalidate')
            .send(data);
    } catch (e) {
        console.error("Internal server error on train timetable ", e);
        return res.sendStatus(500);
    }
}
