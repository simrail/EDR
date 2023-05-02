import {newInternalIdToSrId, POSTS} from "./config.js";
import express from "express";
import {getStationTimetable} from "./dataTransformer/stations.js";
import {getTrainTimetable} from "./dataTransformer/train.js";
import _ from "lodash";
import { IFrontendStationTrainRow } from "./interfaces/IFrontendStationTrainRow.js";
import { IServerTrain } from "./interfaces/IServerTrain.js";
import { ISpeedLimit } from "./interfaces/ISpeedLimit.js";

const mergePostRows = (allPostsResponse: IFrontendStationTrainRow[][]) => {
    const primaryPostRows = allPostsResponse[0];
    const secondaryPostsRows = allPostsResponse.slice(1);

    const keyedSecondaryPostsRows = secondaryPostsRows.map((secondaryPostRows) => _.keyBy(secondaryPostRows, 'trainNoLocal'));

    // Handle stations that have multiple posts, merge their data into a single entry
    const mergedPostsRows = primaryPostRows.reduce((acc, v) => [
        ...acc,
        {
            ...v,
            secondaryPostsRows: keyedSecondaryPostsRows.map((kspr) => kspr[v.trainNoLocal])
        }
    ], new Array<IFrontendStationTrainRow>());

    const keyedFirstPostTrains = _.keyBy(primaryPostRows, 'trainNoLocal');

    secondaryPostsRows.map((secondary_post_trains) => {
        secondary_post_trains.map(train => {
            if (!keyedFirstPostTrains[train.trainNoLocal]) {
                mergedPostsRows.push(train);
            }
        });
    });

    return _.sortBy(mergedPostsRows, 'scheduledArrivalObject');
}

export async function dispatchController(req: express.Request, res: express.Response, trainList: IServerTrain[]) {
    const { post } = req.params;

    if (trainList === undefined || trainList === null) {
        console.error("Timetable is empty, cannot process dispatch request!")
        return res.sendStatus(500);
    }

    if (!newInternalIdToSrId[post]){
        return res.status(400).send({
            "error": "PEBKAC",
            "message": "Server or post is not supported"
        });
    }

    try {
        const mergePosts = req.query.mergePosts === "true";
        const postsToFetch = mergePosts ? POSTS[post] : [newInternalIdToSrId[post]];
        const data = await Promise.all(postsToFetch.map(post => getStationTimetable(post, trainList)));
        const mergedPosts = mergePostRows(data);
        return res
            .setHeader("Cache-control", 'public, max-age=28800 stale-if-error=604800 must-revalidate')
            .send(mergedPosts);
    } catch (e) {
        console.error("Internal server error on dispatch timetable ", e);
        return res.sendStatus(500);
    }
}

export async function trainTimetableController(req: express.Request, res: express.Response, trainList: IServerTrain[], speedLimits: ISpeedLimit[]) {
    const {trainNo} = req.params;

    if (trainList === undefined || trainList === null) {
        console.error("Timetable is empty, cannot process train timetable request!")
        return res.sendStatus(500);
    }

    try {
        const data = await getTrainTimetable(trainNo, trainList, speedLimits);
        res
            .setHeader("Cache-control", 'public, max-age=28800 stale-if-error=604800 must-revalidate')
            .send(data);
    } catch (e) {
        console.error("Internal server error on train timetable ", e);
        return res.sendStatus(500);
    }
}
