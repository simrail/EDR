const pupeeter = require("puppeteer");
const process = require("node:process");
const SIMRAIL_EDR_URL = process.env["SIMRAIL_EDR_URL"];

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

/**
 * Parse the content of the timetable and returns the format as a JSON
 * @param pageContent
 */
function parsePartialTimetable(pageContent) {
    // TODO
}

/**
 * Main scrapper function
 * @returns {Promise<void>}
 */
async function scrapMap() {
    const page = await initScrapperBrowser();
    const htmlContent = await page.content();

    console.log("HTML content ", htmlContent);

    // Now we are awaiting
    const elements = await page.$$('tr');

    console.log("Elements : ", elements);
    await elements[2].click({delay: 2000})

    const trainRouteButton = await page.$x("//a[contains(text(), 'Train route')]")
    await Promise.all([
            trainRouteButton[0].click({
            delay: 2000
        }),
        page.waitForNavigation()
    ]);

    await  new Promise(r => setTimeout(r, 10000));
    const trainRouteContent = await page.content();
    console.log("HTML content ", trainRouteContent);

    const trainListButton = await page.$x("//a[contains(text(), 'Train list')]")
}
module.exports = {
    scrapMap
};
