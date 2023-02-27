import { scrapRoute } from "./scrapper";
import {internalIdToSrId, newInternalIdToSrId, POSTS, verboseStopTypeToStationStopType} from "./config";
import express from "express";
import {getStationTimetable} from "./sql/stations";
import {getTrainTimetable} from "./sql/train";
import _ from "lodash";

const mergePostRows = (allPostsResponse: any[]) => {
    const primaryPostRows = allPostsResponse[0];
    const secondaryPostsRows = allPostsResponse.slice(1);

    const keyedSecondaryPostsRows = secondaryPostsRows.map((secondaryPostRows) => _.keyBy(secondaryPostRows, 'train_number'));

    // Handle stations that have multiple posts, merge their data into a single entry
    const mergedPostsRows = primaryPostRows.reduce((acc: any[], v: any) => [
        ...acc,
        {
            ...v,
            secondaryPostsRows: keyedSecondaryPostsRows.map((kspr) => kspr[v.train_number])
        }
    ], []);

    const keyedFirstPostTrains = _.keyBy(primaryPostRows, 'train_number');

    // TODO: This has state, temporary fix
    secondaryPostsRows.map((secondary_post_trains: any[]) => {
        for (const train of secondary_post_trains) {
            if (!keyedFirstPostTrains[train.train_number])
                mergedPostsRows.push(train);
        }
    });

    return _.sortBy(mergedPostsRows, 'hourSort');
}

export async function dispatchController(req: express.Request, res: express.Response) {
    const {post} = req.params;

    if (!internalIdToSrId[post])
        return res.status(400).send({
            "error": "PEBKAC",
            "message": "Server or post is not supported"
        })

    console.log(`${post}`);
    try {
        const mergePosts = req.query.mergePosts === "true"
        const postsToFetch = mergePosts ? POSTS[post] : [newInternalIdToSrId[post]];
        const data = await Promise.all(postsToFetch.map(getStationTimetable));
        const mergedPosts = mergePostRows(data);
        return res
            .setHeader("Cache-control", 'public, max-age=86400 stale-if-error=604800 must-revalidate')
            .send(mergedPosts)
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

const convertSrApiRow = (srTrainApiRow: any) => {
    const arrivalTime = srTrainApiRow.arrivalTime?.split(" ")[1];
    return {
        train_number: srTrainApiRow.displayedTrainNumber,
        scheduled_arrival_hour: arrivalTime,
        scheduled_departure_hour: srTrainApiRow.departureTime?.split(" ")[1],
        train_type: srTrainApiRow.trainType,
        line: srTrainApiRow.line,
        km: srTrainApiRow.mileage,
        maxSpeed: srTrainApiRow.maxSpeed,
        stop_type: verboseStopTypeToStationStopType[srTrainApiRow.stopType],
        hourSort: Number.parseInt(arrivalTime?.replace(':', '') ?? 0),
        station: srTrainApiRow.nameForPerson
    }
}

export async function trainTimetableController(req: express.Request, res: express.Response) {
    const {trainNo} = req.params;

    try {
        const data = (global as any).trainData[trainNo]?.timetable?.map(convertSrApiRow);
        console.log("Data : ", data);

        res
            .setHeader("Cache-control", 'public, max-age=86400 stale-if-error=604800 must-revalidate')
            .send(data)
    } catch (e) {
        console.error("Internal server error on train timetable ", e);
        return res.sendStatus(500);
    }
}
