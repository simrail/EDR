const cheerio = require("cheerio");
const _ = require("lodash");
const CONFIG = require("./config");
const simRailClient = require("./simrailClient");

module.exports.default = async (res, server, post) => {
    const simrailResponse = await simRailClient.get(`?station=${post}&serverCode=${server}`, CONFIG.BASE_SIMRAIL_DISPATCH_API);

    if (simrailResponse.status !== 200) {
        return [undefined, res.status(simrailResponse.status).send({
            "error": "Simrail",
            "message": simrailResponse.statusText
        })];
    }

    try {
        const $ = cheerio.load(simrailResponse.data);
        const headers = $('th').toArray().map((el) => el.children?.[0]?.data);
        const rows1 = $('.timetableRow').toArray()
            .map(e => e.children)
            .map(e => e.filter(e => e?.name === 'td').flatMap(e => e.children[0]?.data));

        console.log("Headers : ", headers);
        console.log("rws ; ", rows1[0]);
        const batchedRows = rows1.map((r) => _.reduce(r, (acc, v, i) => {
            const targetKey = CONFIG.translate_fields[headers[i]]
            return {
                ...acc,
                [targetKey]: !!acc[targetKey] ? acc[targetKey] : v
            };
        }, {})).map((row) => ({
            ...row,
            type_speed: CONFIG.vmax_by_type[row.type],
            hourSort: (Number.parseInt(row.scheduled_arrival.split(':')[0]) * 60) + Number.parseInt(row.scheduled_arrival.split(':')[1])
        }))

        return [batchedRows, undefined];
    } catch (e) {
        console.trace(e);
        return [undefined, res.status(500).send({
            "error": "Ohoh",
            "message": "Something went wrong parsing SimRail data, contact deadly",
            "moreInfo": e.message
        })];
    }
}