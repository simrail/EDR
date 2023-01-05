const cheerio = require("cheerio");
const _ = require("lodash");
const CONFIG = require("./config");
const simRailClient = require("./simrailClient");

// TODO: Merge posts with two target posts
module.exports.default = async (res, server, post) => {
    const allPosts = CONFIG.POSTS[post];
    const simrailResponses = await Promise.all(allPosts.map((p) => simRailClient.get(`?station=${p}&serverCode=${server}`, CONFIG.BASE_SIMRAIL_DISPATCH_API)));

    if (simrailResponses.filter((sr) => sr.status >= 400).length > 0) {
        return [undefined, res.status(simrailResponse.status).send({
            "error": "Simrail",
            "message": simrailResponse.statusText
        })];
    }
    console.log("Posts to fetch :", CONFIG.POSTS[post])

    const convertRow = (headers) => (r) => _.reduce(r, (acc, v, i) => {
        const targetKey = CONFIG.translate_fields[headers[i]]
        return {
            ...acc,
            [targetKey]: !!acc[targetKey] ? acc[targetKey] : v
        };
    }, {});


    try {
        const rows = simrailResponses.map((sr) => {
            const $ = cheerio.load(sr.data);
            const headers = $('th').toArray().map((el) => el.children?.[0]?.data);
            const rows1 = $('.timetableRow').toArray()
                .map(e => e.children)
                .map(e => e.filter(e => e?.name === 'td').flatMap(e => e.children[0]?.data));

            // console.log("Rows 1 ", rows1);
            const batchedRows = rows1.map(convertRow(headers))
            .map((row) => ({
                ...row,
                type_speed: CONFIG.vmax_by_type[row.type],
                hourSort: (Number.parseInt(row.scheduled_arrival.split(':')[0]) * 60) + Number.parseInt(row.scheduled_arrival.split(':')[1])
            }))
            return batchedRows;
        });

        const primaryPostRows = rows[0];
        const secondaryPostsRows = rows.slice(1);


        const keyedSecondaryPostsRows = secondaryPostsRows.map((secondaryPostRows) => _.keyBy(secondaryPostRows, 'train_number'));

        // console.log("KSPR", keyedSecondaryPostsRows);

        const mergedPostsRows = primaryPostRows.reduce((acc, v) => [
            ...acc,
            {
                ...v,
                secondaryPostsRows: keyedSecondaryPostsRows.map((kspr) => kspr[v.train_number])
            }
        ], []);

        const keyedFirstPostTrains = _.keyBy(primaryPostRows, 'train_number');

        // TODO: This has state, temporary fix
        secondaryPostsRows.map((sptr) => {
            sptr.forEach((trainRow) => {
                if (!keyedFirstPostTrains[trainRow.train_number])
                    mergedPostsRows.push(trainRow);
            })
        })

        return [_.sortBy(mergedPostsRows, 'hourSort'), undefined];
    } catch (e) {
        console.trace(e);
        return [undefined, res.status(500).send({
            "error": "Ohoh",
            "message": "Something went wrong parsing SimRail data, contact deadly",
            "moreInfo": e.message
        })];
    }
}