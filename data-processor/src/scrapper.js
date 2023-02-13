const pupeeter = require("puppeteer");
const process = require("node:process");
const select = require ('puppeteer-select');
const cheerio = require('cheerio');
const _ = require("lodash");
const SIMRAIL_EDR_URL = process.env["SIMRAIL_EDR_URL"];

// THIS SHOULD BE IN A NPM LIB TO SHARE WITH THE API (in fact, no need ?)
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

// THIS SHOULD BE IN A NPM LIB TO SHARE WITH THE API (in fact, no need ?)
// TODO: Handle Hour
const translate_fields_train_timetable = {
    "Sched. arrival": "scheduled_arrival",
    "Hour": ["scheduled_arrival_hour", "real_arrival_hour", "scheduled_departure_hour", "real_departure_hour"],
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

const SCRAPPER_TIMETABLE_ROW_HEIGHT = 35;
const SCRAPPER_SELECTED_ROW_CLASSNAME = "timetableRow selectedRow";
const SCRAPPER_TIMETABLE_PAGE_LEN = 16;
const SCRAPPER_TIMETABLE_MAX_ROWS = 400; // If it evers choke, lets not make an inifinite loop :D
const SCRAPPER_TRAINS_MAX_ROWS = 50; // If it evers choke, lets not make an inifinite loop :D
const SCRAPPER_TIMETABLE_CLASSNAME_ROWS = {
    "trains": ".timetableTrainRow",
    "stations": ".timetableRow"
}

const SCRAPPER_TIMETABLE_HEADERS_TRANSLATION = {
    "trains": translate_fields_train_timetable,
    "stations": translate_fields_station_timetable
}

const SCRAPPER_TIMETABLE_HEADERS_ADD_DATA_CALLBACK = {
    "trains": translate_fields_train_timetable,
    "stations": translate_fields_station_timetable
}



const Promise_sequence = (promiseAry) => promiseAry.reduce((p, fn) => p.then(fn), Promise.resolve());


// TODO: Store the time offset of the server at reboot or make a simple scrapper that will only scrap the time (is it accurate ?)

/**
 * This inits a chromium browsers and goes to the official EDR page
 * @returns {Promise<Page>}
 */
async function initScrapperBrowser(stationId) {
    const browser = await pupeeter.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(SIMRAIL_EDR_URL + "?stationId="+stationId+"&serverCode=biuro", {referer: "Community EDR Scrapper v2"});
    global.scrapBrowser = browser; // To chatch in case of unexpected error and free resource
    return [browser, page];
}

const convertRow = (headers, translationHashMap) => (row) => {
    let contextualHeadersHashMap = {};
    return _.reduce(row, (acc, v, i) => {
        // Some rows like "Hours" are duplicated, hence we need to keep track of wich one do we want
        const headersVal = headers[i];
        let targetKey = (translationHashMap)[headersVal];

        if (Array.isArray(targetKey)) {
            let targetContextualParseIndex = contextualHeadersHashMap[headersVal] === undefined ? 0 : contextualHeadersHashMap[headersVal] + 1;
            let tmp = targetKey[targetContextualParseIndex]
            contextualHeadersHashMap[headersVal] = targetContextualParseIndex;
            targetKey = tmp;
            // console.log("Parsing target key", contextualHeadersHashMap);
        }

        return {
            ...acc,
            [targetKey]: !!acc[targetKey] ? acc[targetKey] : v
        };
    }, {});
}

/**
 * Generic parser for all Official EDR tables.
 *
 * @param sr                      Whatever HTML from Simrail containing a standardized table
 * @param headerTranslationConfig Configuration to put the keys on the JSON for the header of the cell in table
 * @param additionnalDataCallback Callback to execute to populate more data on the row.  (row: T) => Object
 * @returns {unknown[]}           Array of <T> timetable rows where T is Simrail resource
 */
const parseTimetable = (sr, objectType = "trains") => {
    // TODO: Sanity check - the simrail response list may contain undefined values
    const $ = cheerio.load(sr);
    // XXX: Element is forcibly any because Cheerio doesn't expose specific types for the retrieved elements
    const headers = $('th').toArray().map((el) => {
        const childrenData = el.children?.map((c) => c.data).filter((e) => !!e).join(' ');
        if (childrenData)
            return childrenData.replace('! ', ''); // Blazor shenanigans on n+1 renders
        return el.children?.children
    });

    // console.log("With headers ", headers);

    const rowClassName = SCRAPPER_TIMETABLE_CLASSNAME_ROWS[objectType]

    if (!rowClassName) {
        console.error("No row classname found for objectType : ", objectType);
        return [];
    }

    const rows1 = $(rowClassName).toArray()
        .map(e => e.children)
        .map(e => e.filter((e) => e?.name === 'td').flatMap((e) => e.children[0]?.data));

    // console.log("With headers", headers);
    // console.log("Rows 1 ", rows1);
    // console.log("Headers : ", headers);
    const translationHashMap = SCRAPPER_TIMETABLE_HEADERS_TRANSLATION[objectType];
    const convertedRows = rows1.map(convertRow(headers, translationHashMap));
    // console.log("Converted rows : ", convertedRows);

    if (objectType === "trains") {
        return convertedRows;
    }

    const batchedRows = convertedRows
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

async function goToTopOfTable(page, mode) {
    console.log("Scroll up.... ")
    const scrollTarget = (mode === "trains" ? 40 : 300)
    for (let i = 0; i < scrollTarget ; i++) {
            await Promise.all([new Promise(r => setTimeout(r, 50)),
            await page.mouse.wheel({deltaY: -SCRAPPER_TIMETABLE_ROW_HEIGHT})
        ]);
    }
}

async function scrollRow(allTrainNumbers, page) {
    return Promise.all([
         new Promise(r => setTimeout(r, 50)),
         page.mouse.wheel({deltaY: SCRAPPER_TIMETABLE_ROW_HEIGHT * allTrainNumbers.length})
     ]);
}

// TODO: Needs a bit of refactoring, since all trains are resetted when navigating. K idc i'll just scrap every 30mn
async function scrapTrainPage(allTrainNumbers, page) {
    for (let i = 0; i < allTrainNumbers.length - 1; i++) {
        const trainNumber = allTrainNumbers[i];
        const tr = await select(page).getElement('td:contains(' + trainNumber + ')')
        console.log("⌛ Preparing to scrap tr at index : ", i);
        await new Promise(r => setTimeout(r, 2000));
        try {
            let tries = 0;
            let maxRetries = 3;
            while (true) {
                try {
                    await tr.click({delay: 1000});
                    break;
                } catch (e) {
                    tries++;
                    if (tries === maxRetries) {
                        throw e;
                    } else {
                        console.warn("Failed to click retrying")
                    }
                }
            }
            const trainRouteButton = await page.$x("//a[contains(text(), 'Train route')]")
            await Promise.all([
                trainRouteButton[0].click({
                    delay: 1000
                }),
                page.waitForNavigation()
            ]);
            // console.log("Waiting for page load");
            await new Promise(r => setTimeout(r, 1000));

            //parsePartialTimetable(trainRouteContent, trainNumber)

            const trTrainPage = await select(page).getElement('td');
            await trTrainPage.click();

            await goToTopOfTable(page, "trains");
            // TODO: Navigating to get all the rows generated by Blazor
            for (let z = 0; z < SCRAPPER_TRAINS_MAX_ROWS; z++) {
                const trainRouteContent = await page.content();
                if (z % SCRAPPER_TIMETABLE_PAGE_LEN === 0) {
                    const trainTT = parseTimetable(trainRouteContent, "trains");
                    await insertTrainTimetableRow(trainTT, trainNumber);
                }
                await scrollRow(allTrainNumbers, page);
            }
            await new Promise(r => setTimeout(r, 100));
            const trainRouteContent = await page.content();
            const trainTT = parseTimetable(trainRouteContent, "trains");
            await insertTrainTimetableRow(trainTT, trainNumber);
            // TODO: Parse whole table via scrolling
        } catch (e) {
            console.error("Failed to parse row : ", e);
        }

        await  new Promise(r => setTimeout(r, 3000));
        const trainListButton = await page.$x("//a[contains(text(), 'Train list')]")
        await Promise.all([
            trainListButton[0].click(),
            page.waitForNavigation()
        ]);
        await  new Promise(r => setTimeout(r, 2000));
    }

}
/**
 * Main scrapper function
 * @returns {Promise<void>}
 */

// TODO: The timetable needs a way to go up somehow. This would gather more data for the station timetable
// TODO: And also avoid partial data trains on some cases
async function scrapTimetable(mode, simRailStationId) {
    console.log("🌍 Scrapping started ! Chromium is starting ...");
    const [browser, page] = await initScrapperBrowser(simRailStationId);
    console.log("🦀 Waiting for Blazor");
    await page.setViewport({width: 1920, height: 1080});
    await new Promise(r => setTimeout(r, 3000));
    const htmlContent = await page.content();

    // console.log("HTML content ", htmlContent);

    const res = parseTimetable(htmlContent, "stations");

    // console.log("Response : ", res);

    // Getting all train timetables of the station
    const trainRows = await page.$$('tr');
    const [, , ...withoutHeaderTrainRows] = trainRows;

    let allTrainNumbers = res.map((trainRow) => trainRow.train_number);

    // await insertPartialTimetableInDb(res, 1);
    // console.log("📅 Partial timetable was saved in DB", new Date());

    console.log("Debug tr numbers : ", allTrainNumbers)
    const tr = await select(page).getElement('td:contains('+allTrainNumbers[1]+')');
    await tr.click();
    await  new Promise(r => setTimeout(r, 1000));
    if (mode === "stations") {
        await goToTopOfTable(page, mode);
        for (let i = 0; i < SCRAPPER_TIMETABLE_MAX_ROWS; i++) {
            // TODO: Find if page scrapping is done. (Keep first train fetched, then, when the arrays contains it, we have cycled the timetable)
            if (i % SCRAPPER_TIMETABLE_PAGE_LEN === 0) {
                console.log("Scrapping 10 rows...")
                const htmlContent = await page.content();
                // console.log("Current content : ", htmlContent);
                const allRows = parseTimetable(htmlContent, "stations");
                await insertPartialTimetableInDb(allRows, simRailStationId);
                /*const tableHaveCycled = i > SCRAPPER_TIMETABLE_PAGE_LEN * 2 && +allTrainNumbers[1] && _.intersection(allRows.map((r) => r.train_number), allTrainNumbers).length > 0;
                if (tableHaveCycled) {
                    console.log("Table have cycled, exiting loop !");
                    break;
                }*/
            }

            await new Promise(r => setTimeout(r, 100));
            await scrollRow(allTrainNumbers, page);
        }
        await new Promise(r => setTimeout(r, 10000));
    } else {
        // It would be too expensive to fetch all the trains inside the table, so I just fetch the train numbers
        // and hope the timetable will not change just now :D
        // TODO: Optimize, we can just skip trains that are already in DB and with valid cache time
        console.log("⌛ Preparing to scrap trains : ", allTrainNumbers)
        await scrapTrainPage(allTrainNumbers, page)
    }
    // await page.mouse.move(1920 / 2, 1080 / 2);
    // Promise_sequence(_.range(0, 20).map(() => scrollRow(page)));
    // await scrapTrainPage(allTrainNumbers, page);
    await browser.close();

    console.log("Scrapping complete !")
    // process.exit(0)
    return new Promise((r) => r());
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
                "SELECT * FROM stations_timetable_row WHERE simrail_new_edr_station_id=$1 AND train_number=$2",
                [simrailEDRStationId.toString(), trainRow.train_number]
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

async function insertTrainTimetableRow(scrappedRows, trainNumber) {
    const conn = global.pgClient;
        return Promise.all(scrappedRows.map(async (scrappedRow) => {
            try {
                const dataBaseRow = await conn.query(
                    "SELECT * FROM trains_timetable_row WHERE train_number=$1 AND station=$2",
                    [trainNumber, scrappedRow.station]
                ).then((r) => r.rows?.[0]);


                if (!!dataBaseRow) {
                    console.log("🏍️  Train line cache hit : (PK: " + dataBaseRow.train_number + " | " + scrappedRow.station + ")");
                } else {
                    console.log("📅 Train row saved in DB " + trainNumber, new Date());
                    // console.log("R ", scrappedRow);
                    return await pgClient.query(`INSERT INTO trains_timetable_row (
                        train_number,
                        scheduled_arrival,
                        scheduled_arrival_hour,
                        real_arrival,
                        real_arrival_hour,
                        station,
                        layover,
                        scheduled_departure_hour,
                        real_departure,
                        real_departure_hour,
                        train_type,
                        line,
                        cacheDate,
                        stop_type
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`, [
                        trainNumber,
                        scrappedRow.scheduled_arrival,
                        scrappedRow.scheduled_arrival_hour,
                        scrappedRow.real_arrival,
                        scrappedRow.real_arrival_hour,
                        scrappedRow.station,
                        scrappedRow.layover,
                        scrappedRow.scheduled_departure_hour,
                        scrappedRow.real_departure,
                        scrappedRow.real_departure_hour,
                        scrappedRow.type,
                        scrappedRow.line,
                        new Date(),
                        scrappedRow.stop_type
                    ]);

                }
            } catch (e) {
                console.error("Error inserting line : ", e);
            }
    }))
}
