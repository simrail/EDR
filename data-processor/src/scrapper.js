const pupeeter = require("puppeteer");
const process = require("node:process");
const select = require ('puppeteer-select');
const cheerio = require('cheerio');
const _ = require("lodash");
const SIMRAIL_EDR_URL = process.env["SIMRAIL_EDR_URL"];

const translate_fields = {
    "K": "k",
    "N K": "nk",
    "Scheduled arrival": "scheduled_arrival",
    "+/-": "offset",
    "Real arrival": "real_arrival",
    "Type": "type",
    "Train no.": "train_number",
    "From post": "from",
    "To post": "to",
    "Track": "track",
    "Line no.": "line",
    "Layover": "layover",
    "Stop type": "stop_type",
    "P T": "platform",
    "Scheduled departure": "scheduled_departure",
    "Real departure": "real_departure",
    "Start station": "start_station",
    "Terminus station": "terminus_station",
    "Carrier": "carrier"
}

const Promise_sequence = (promiseAry) => promiseAry.reduce((p, fn) => p.then(fn), Promise.resolve());


// TODO: Store the time offset of the server at reboot or make a simple scrapper that will only scrap the time (is it accurate ?)

/**
 * This inits a chromium browsers and goes to the official EDR page
 * @returns {Promise<Page>}
 */
async function initScrapperBrowser() {
    const browser = await pupeeter.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(SIMRAIL_EDR_URL + "?stationId=2375&serverCode=biuro", {referer: "Community EDR Scrapper v2"})
    return page;
}

const convertRow = (headers) => (row) => _.reduce(row, (acc, v, i) => {
    const targetKey = (translate_fields)[headers[i]];
    return {
        ...acc,
        [targetKey]: !!acc[targetKey] ? acc[targetKey] : v
    };
}, {});


const parseTimetable = (sr) => {
    // TODO: Sanity check - the simrail response list may contain undefined values
    const $ = cheerio.load(sr);
    // XXX: Element is forcibly any because Cheerio doesn't expose specific types for the retrieved elements
    const headers = $('th').toArray().map((el) => {
        const childrenData = el.children?.map((c) => c.data).filter((e) => !!e).join(' ');
        if (childrenData)
            return childrenData;
        return el.children?.children
    });
    const rows1 = $('.timetableRow').toArray()
        .map(e => e.children)
        .map(e => e.filter((e) => e?.name === 'td').flatMap((e) => e.children[0]?.data));

    // console.log("Processed rows : ", rows1.map(convertRow(headers)));

    // console.log("Rows 1 ", rows1);
    // console.log("Headers : ", headers);
    const batchedRows = rows1.map(convertRow(headers))
        .map((row) => {
            const [arrivalDate, arrivalTime] = row.scheduled_departure.split(' ');
            const [departureDate, departureTime] = row.scheduled_departure.split(' ');
            return {
            ...row,
                type_speed: 0/*VMAX_BY_TYPE[row.type]*/,
                arrival_date: arrivalDate,
                departure_date: departureDate,
                arrival_time: arrivalTime,
                departure_time: departureTime,
                hourSort: Number.parseInt(`${arrivalTime.split(':')[0]}${arrivalTime.split(':')[1]}`)
            }
        })
    return batchedRows;
}

/**
 * Parse the content of the timetable and returns the format as a JSON
 * @param pageContent
 */

function parsePartialTimetable(pageContent, trainNumber) {
    // TODO
    console.log("🚆 Train not in database ", trainNumber)
}

function parseTrainData() {

}

/**
 * Main scrapper function
 * @returns {Promise<void>}
 */
async function scrapMap() {
    console.log("🌍 Scrapping started ! Chromium is starting ...");
    const page = await initScrapperBrowser();
    const htmlContent = await page.content();

    // console.log("HTML content ", htmlContent);

    const res = parseTimetable(htmlContent);

    console.log("Response : ", res);

    // Getting all train timetables of the station
    console.log("🦀 Waiting for Blazor");
    await page.setViewport({width: 1920, height: 1080});
    await  new Promise(r => setTimeout(r, 5000));
    const trainRows = await page.$$('tr');
    const [, , ...withoutHeaderTrainRows] = trainRows;

    let allTrainNumbers = res.map((trainRow) => trainRow.train_number);

    await insertPartialTimetableInDb(res, 1);
    console.log("📅 Partial timetable was saved in DB", new Date());

    console.log("⌛ Preparing to scrap trains : ", allTrainNumbers)

    for (let i = 0; i < allTrainNumbers.length; i++) {
        const trainNumber = allTrainNumbers[i];
        const tr = await select(page).getElement('td:contains('+trainNumber+')')
        console.log("⌛ Preparing to scrap tr at index : ", i);
        await tr.click({delay: 1000})
        const trainRouteButton = await page.$x("//a[contains(text(), 'Train route')]")
        await Promise.all([
            trainRouteButton[0].click({
                delay: 1000
            }),
            page.waitForNavigation()
        ]);
        // console.log("Waiting for page load");
        await  new Promise(r => setTimeout(r, 1000));

        const trainRouteContent = await page.content();
        // console.log("HTML content ", trainRouteContent)
        parsePartialTimetable(trainRouteContent, trainNumber)
        const trainListButton = await page.$x("//a[contains(text(), 'Train list')]")
        await Promise.all([
            trainListButton[0].click(),
            page.waitForNavigation()
        ]);
        await  new Promise(r => setTimeout(r, 3000));
    }
    console.log("Scrapping complete !")
    process.exit(0)
}
module.exports = {
    scrapMap
};


// DB

async function insertPartialTimetableInDb(partialTimetableJson, simrailEDRStationId) {
    const conn = global.pgClient;

    return Promise.all(partialTimetableJson.map(async (trainRow) => {
        try {
            const dataBaseRow = await conn.query(
                "SELECT * FROM stations_timetable_row WHERE simrail_new_edr_station_id=$1 AND train_number=$2",
                [simrailEDRStationId.toString(), trainRow.train_number]
            ).then((r) => r.rows?.[0]);

            console.log("Data row : ", dataBaseRow);

            if (dataBaseRow) {
                console.log("Cached row : ", dataBaseRow);
            } else {
                // console.log("To cache row : ", trainRow);
                return await pgClient.query(`INSERT INTO stations_timetable_row (
                    simrail_new_edr_station_id,
                    train_number,
                    train_type,
                    type_speed,
                    stop_type,
                    platform,
                    arrival_time,
                    departure_time,
                    arrival_date,
                    departure_date,
                    from_post,
                    to_post,
                    line,
                    start_station,
                    terminus_station,
                    cacheDate
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`, [
                    simrailEDRStationId,
                    trainRow.train_number,
                    trainRow.type,
                    trainRow.type_speed,
                    trainRow.stop_type,
                    trainRow.platform,
                    trainRow.arrival_time,
                    trainRow.departure_date,
                    trainRow.arrival_date,
                    trainRow.departure_date,
                    trainRow.from,
                    trainRow.to,
                    trainRow.line,
                    trainRow.start_station,
                    trainRow.terminus_station,
                    new Date()
                ])
            }

        } catch (e) {
            // console.error("Error inserting a row ! ", {
            //     row: trainRow,
            //     error: e
            // });
        }
    }));
}
