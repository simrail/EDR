import { load } from "cheerio";
import _ from "lodash";
import { simrailClient } from "./simrailClient";
import express from "express";
import { BASE_SIMRAIL_DISPATCH_API, POSTS, translate_fields, VMAX_BY_TYPE } from "./config";

// TODO: Merge posts with two target posts
export async function scrapRoute(res: express.Response, server: string, post: string): Promise<[any[] | undefined, any]> {
    const allPosts = POSTS[post];
    const simrailResponses: any[] = await Promise.all(allPosts.map((p) => simrailClient.get(`?station=${p}&serverCode=${server}`, BASE_SIMRAIL_DISPATCH_API)));

    try {
    // TODO: There could be undefined values among the responses - see todo comment in simrailClient.get
    if (simrailResponses.filter((sr: any) => sr.status >= 400).length > 0) {
        return [undefined, res.status(500).send({
            "error": "Simrail",
            "message": "Something is wrong with one of the Simrail servers"
        })];
    }
    console.log("Posts to fetch :", POSTS[post])

    const convertRow = (headers: any) => (r: any) => _.reduce(r, (acc, v, i) => {
        const targetKey = (translate_fields as any)[headers[i]];
        return {
            ...acc,
            [targetKey]: !!acc[targetKey] ? acc[targetKey] : v
        };
    }, {} as any);

        const rows = simrailResponses.map((sr) => {
            // TODO: Sanity check - the simrail response list may contain undefined values
            const $ = load(sr.data);
            // XXX: Element is forcibly any because Cheerio doesn't expose specific types for the retrieved elements
            const headers: string[] = $('th').toArray().map((el: any) => el.children?.[0]?.data);
            const rows1 = $('.timetableRow').toArray()
                .map(e => e.children)
                .map(e => e.filter((e: any) => e?.name === 'td').flatMap((e: any) => e.children[0]?.data));

            // console.log("Rows 1 ", rows1);
            const batchedRows = rows1.map(convertRow(headers))
            .map((row) => ({
                ...row,
                type_speed: VMAX_BY_TYPE[row.type],
                hourSort: (Number.parseInt(row.scheduled_arrival.split(':')[0]) * 60) + Number.parseInt(row.scheduled_arrival.split(':')[1])
            }))
            return batchedRows;
        });

        const primaryPostRows = rows[0];
        const secondaryPostsRows = rows.slice(1);

        const keyedSecondaryPostsRows = secondaryPostsRows.map((secondaryPostRows) => _.keyBy(secondaryPostRows, 'train_number'));

        // console.log("KSPR", keyedSecondaryPostsRows);

        // Handle stations that have multiple posts, merge their data into a single entry
        const mergedPostsRows = primaryPostRows.reduce((acc, v) => [
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
        })

        return [_.sortBy(mergedPostsRows, 'hourSort'), undefined];
    // XXX: Any may be incorrect here, check possible errors
    } catch (e: any) {
        console.trace(e);
        return [undefined, res.status(500).send({
            "error": "Ohoh",
            "message": "Something went wrong parsing SimRail data, contact deadly",
            "moreInfo": e.message
        })];
    }
}