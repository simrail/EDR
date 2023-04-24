import express from "express";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import compression from "compression";
import fs from "fs";
import Cron from "cron";
const app = express();
const Logger = morgan('short');

import {dispatchController, getRealtimeDataForPost, trainTimetableController} from "./dispatchController.js";
import {getServerList, getStationsList, getTrainsList, getServerTz, getPlayer, getFullTimetable, getSpeedLimitsFromSimkol, getServerCodeList} from "./serverController.js";
import helmet from "helmet";
import { ISpeedLimitApi } from "./interfaces/ISpeedLimitApi.js";
import { ISpeedLimit } from "./interfaces/ISpeedLimit.js";
import { ConvertSpeedsApiToInternal } from "./helper/speedLimitHelper.js";
import { ICompleteTrainList } from "./interfaces/ICompleteTrainList.js";

let completeTrainList: ICompleteTrainList = {};
let speeds: ISpeedLimit[];
const updateTimetable = () => {
    getServerCodeList().then(async serverList => {
        serverList.map(serverCode => {
            getFullTimetable(serverCode).then(response => {
                completeTrainList[serverCode] = response.data;
                console.log(`${serverCode} timetable updated!`);
            }).catch((e) => {
                console.log(`[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] Error while fetching server timetable (${serverCode}), skipping update!`);
                console.log(e.message);
            });
        });
    }).catch(() => {
        console.log("Cannot fetch server code list, skipping timetable update!");
    });
}

const updateSpeedLimits = () => {
    getSpeedLimitsFromSimkol().then((result) => ConvertSpeedsApiToInternal(result.data)).catch(() => {
        console.log("Error while fetching speed limits from the API, falling back to the bundled version!");
        speeds = ConvertSpeedsApiToInternal(JSON.parse(fs.readFileSync("speeds.json", "utf8")) as ISpeedLimitApi[]);
    });
}

const cronTimetableUpdater = new Cron.CronJob(
    '* * * * *',
    () => { updateTimetable() },
    null,
    false,
    'Europe/Warsaw'
);

const cronSpeedLimitUpdater = new Cron.CronJob(
    '0 4 * * *',
    () => { updateSpeedLimits() },
    null,
    false,
    'Europe/Warsaw'
);

cronTimetableUpdater.start();
cronSpeedLimitUpdater.start();
updateSpeedLimits();

const corsConfig: CorsOptions = {
    allowedHeaders: "content-type",
    maxAge: 3600
};

app.use(cors(corsConfig)).use(Logger).use(helmet()).use(express.json()).use(compression());
app
    /*.set("etag", false)
    .set("Cache-control", "no-cache")*/
    .options('*', cors(corsConfig))
    .get("/", (req: express.Request, res: express.Response) => res.send("Simrail Community EDR"))
    .get("/servers", getServerList)
    .get("/server/tz/:serverCode", getServerTz)
    .get("/stations/:serverCode", getStationsList)
    .get("/trains/:serverCode", getTrainsList)
    .get("/dispatch/:serverCode/:post", (req: express.Request, res: express.Response) => dispatchController(req, res, completeTrainList[req.params.serverCode]))
    .get("/train/:serverCode/:trainNo", (req: express.Request, res: express.Response) => trainTimetableController(req, res, completeTrainList[req.params.serverCode]))
    .get("/realtime/:serverCode/:post", (req: express.Request, res: express.Response) => getRealtimeDataForPost(req, res, completeTrainList[req.params.serverCode]))
    .get("/steam/:steamId", getPlayer);
app.listen(process.env.LISTEN_PORT);

console.log("🚆 Simrail Community EDR backend v2.2");
console.log("💻 https://github.com/simrail/EDR");
console.log("🐛 https://github.com/simrail/EDR/issues")
