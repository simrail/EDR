const pupeeter = require("puppeteer");
const process = require("node:process");
const select = require ('puppeteer-select');
const cheerio = require('cheerio');
const _ = require("lodash");
const SIMRAIL_EDR_URL = process.env["SIMRAIL_EDR_URL"];

const SCRAPPER_TIMETABLE_ROW_HEIGHT = 35;
const SCRAPPER_SELECTED_ROW_CLASSNAME = "timetableRow selectedRow";
const SCRAPPER_TIMETABLE_PAGE_LEN = 16;
const SCRAPPER_TIMETABLE_MAX_ROWS = 300;

// THIS SHOULD BE IN A NPM LIB TO SHARE WITH THE API
const translate_fields_station_timetable = {
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

// THIS SHOULD BE IN A NPM LIB TO SHARE WITH THE API
// TODO: Handle Hour
const translate_fields_train_timetable = {
    "Sched. arrival": "scheduled_arrival",
    "Hour": "scheduled_arrival_hour",
    "Real arrival": "real_arrival",
    "C": "c",
    "Station": "station",
    "Layover": "layover",
    "Stop type": "stop_type",
    "Sched. departure": "scheduled_departure",
    "Real departure": "real_departure",
    "Type": "type",
    "Line no.": "line"
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
    const targetKey = (translate_fields_station_timetable)[headers[i]];
    return {
        ...acc,
        [targetKey]: !!acc[targetKey] ? acc[targetKey] : v
    };
}, {});

// THIS SHOULD BE IN A NPM LIB TO SHARE WITH THE API
const getObjectExposedKey = () => {

}

/**
 * Generic parser for all Official EDR tables.
 *
 * @param sr                      Whatever HTML from Simrail containing a standardized table
 * @param headerTranslationConfig Configuration to put the keys on the JSON for the header of the cell in table
 * @param additionnalDataCallback Callback to execute to populate more data on the row.  (row: T) => Object
 * @returns {unknown[]}           Array of <T> timetable rows where T is Simrail resource
 */
const parseTimetable = (sr, headerTranslationConfig, additionnalDataCallback) => {
    // TODO: Sanity check - the simrail response list may contain undefined values
    const $ = cheerio.load(sr);
    // XXX: Element is forcibly any because Cheerio doesn't expose specific types for the retrieved elements
    const headers = $('th').toArray().map((el) => {
        const childrenData = el.children?.map((c) => c.data).filter((e) => !!e).join(' ');
        if (childrenData)
            return childrenData.replace('! ', ''); // Blazor shenanigans on n+1 renders
        return el.children?.children
    });
    const rows1 = $('.timetableRow').toArray()
        .map(e => e.children)
        .map(e => e.filter((e) => e?.name === 'td').flatMap((e) => e.children[0]?.data));

    // console.log("Processed rows : ", rows1.map(convertRow(headers)));

    // console.log("With headers", headers);
    // console.log("Rows 1 ", rows1);
    // console.log("Headers : ", headers);
    const batchedRows = rows1.map(convertRow(headers))
        .map((row) => {
            // console.log("Row : ", row);
            if (!row.train_number) return undefined;
            // console.log("Row : ", row);
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

async function scrollRow(allTrainNumbers, page) {
    return Promise.all([
         new Promise(r => setTimeout(r, 200)),
         page.mouse.wheel({deltaY: SCRAPPER_TIMETABLE_ROW_HEIGHT * allTrainNumbers.length})
     ]);
}

// TODO: Needs a bit of refactoring, since all trains are resetted when navigating. K idc i'll just scrap every 30mn
async function scrapTrainPage(allTrainNumbers, page) {
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
        //parsePartialTimetable(trainRouteContent, trainNumber)
        const trainListButton = await page.$x("//a[contains(text(), 'Train list')]")
        await Promise.all([
            trainListButton[0].click(),
            page.waitForNavigation()
        ]);
        await  new Promise(r => setTimeout(r, 3000));
        await  new Promise(r => setTimeout(r, 1000));
    }

}
/**
 * Main scrapper function
 * @returns {Promise<void>}
 */
async function scrapTimetable(mode = "station") {
    console.log("🌍 Scrapping started ! Chromium is starting ...");
    const page = await initScrapperBrowser();
    const htmlContent = await page.content();

    // console.log("HTML content ", htmlContent);

    const res = parseTimetable(htmlContent);

    // console.log("Response : ", res);

    // Getting all train timetables of the station
    console.log("🦀 Waiting for Blazor");
    await page.setViewport({width: 1920, height: 1080});
    await new Promise(r => setTimeout(r, 2000));
    const trainRows = await page.$$('tr');
    const [, , ...withoutHeaderTrainRows] = trainRows;

    let allTrainNumbers = res.map((trainRow) => trainRow.train_number);

    // await insertPartialTimetableInDb(res, 1);
    console.log("📅 Partial timetable was saved in DB", new Date());

    const tr = await select(page).getElement('td:contains('+allTrainNumbers[1]+')');
    await tr.click();
    await  new Promise(r => setTimeout(r, 1000));
    if (mode === "station") {
        for (let i = 0; i < SCRAPPER_TIMETABLE_MAX_ROWS; i++) {
            // TODO: Find if page scrapping is done. (Keep first train fetched, then, when the arrays contains it, we have cycled the timetable)
            if (i % SCRAPPER_TIMETABLE_PAGE_LEN === 0) {
                console.log("Scrapping 10 rows...")
                const htmlContent = await page.content();
                // console.log("Current content : ", htmlContent);
                const allRows = parseTimetable(htmlContent);
                await insertPartialTimetableInDb(allRows, 1);
                const tableHaveCycled = i > SCRAPPER_TIMETABLE_PAGE_LEN * 2 && +allTrainNumbers[1] && _.intersection(allRows.map((r) => r.train_number), allTrainNumbers).length > 0;
                if (tableHaveCycled) {
                    console.log("Table have cycled, exiting loop !");
                    break;
                }
            }

            await new Promise(r => setTimeout(r, 100));
            await scrollRow(allTrainNumbers, page);
        }
        await new Promise(r => setTimeout(r, 10000));
    } else {
        // It would be too expensive to fetch all the trains inside the table, so I just fetch the train numbers
        // and hope the timetable will not change just now :D
        for (let i  = 0; i < 9999; i++) {
            console.log("⌛ Preparing to scrap trains : ", allTrainNumbers)
        }
    }
    // await page.mouse.move(1920 / 2, 1080 / 2);
    // Promise_sequence(_.range(0, 20).map(() => scrollRow(page)));
    // await scrapTrainPage(allTrainNumbers, page);

    console.log("Scrapping complete !")
    process.exit(0)
}
module.exports = {
    scrapMap: scrapTimetable
};


// DB

async function insertPartialTimetableInDb(partialTimetableJson, simrailEDRStationId) {
    const conn = global.pgClient;

    return Promise.all(partialTimetableJson.map(async (trainRow) => {
        try {
            const dataBaseRow = await conn.query(
                "SELECT * FROM stations_timetable_row WHERE simrail_new_edr_station_id=$1 AND train_number=$2 AND arrival_date=$3 AND departure_date=$4",
                [simrailEDRStationId.toString(), trainRow.train_number, trainRow.arrival_date, trainRow.departure_date]
            ).then((r) => r.rows?.[0]);

            // console.log("Data row : ", dataBaseRow);

            if (!!dataBaseRow) {
                console.log("🏍️  Timetable cache hit : (PK: " + dataBaseRow.train_number + " | " + trainRow.arrival_date + " | " + trainRow.departure_date + ")");
            } else {
                // console.log("To cache row : ", trainRow);
                console.log("📅 Train Timetable saved for : " + trainRow.train_number, new Date());
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
                    trainRow.departure_time,
                    trainRow.arrival_date,
                    trainRow.departure_date,
                    trainRow.from,
                    trainRow.to,
                    trainRow.line,
                    trainRow.start_station,
                    trainRow.terminus_station,
                    new Date()
                ]);
            }

        } catch (e) {
            console.error("Error inserting a row ! ", {
                row: trainRow,
                error: e
            });
        }
    }));
}
