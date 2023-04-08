import express from "express";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import compression from "compression";
import fs from "fs";
import Cron from "cron";
const app = express();
const Logger = morgan('short');

import {dispatchController, trainTimetableController} from "./dispatchController.js";
import {getServerList, getStationsList, getTrainsList, getServerTz, getPlayer, getFullTimetable} from "./serverController.js";
import helmet from "helmet";
import { IServerTrain } from "./interfaces/IServerTrain.js";

let trainList: IServerTrain[];
const updateTimetable = (serverCode: string) => {
    getFullTimetable(serverCode).then((response) => {
        trainList = response.data as IServerTrain[];
    }).catch(() => {
        console.log("Error while requesting official timetable data from the API, falling back to the bundled version!")
        trainList = JSON.parse(fs.readFileSync("official-edr-data_static.json", "utf8")) as IServerTrain[];
    })
}

const cronTimetableUpdater = new Cron.CronJob(
    '0 4 * * *',
    () => { updateTimetable("en1")},
    null,
    false,
    'Europe/Warsaw'
);

cronTimetableUpdater.start();
updateTimetable('en1');

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
    .get("/dispatch/:post", (req: express.Request, res: express.Response) => dispatchController(req, res, trainList))
    .get("/train/:trainNo", (req: express.Request, res: express.Response) => trainTimetableController(req, res, trainList))
    .get("/steam/:steamId", getPlayer);
app.listen(process.env.LISTEN_PORT);

console.log("🚆 Simrail Community EDR backend v2.1");
console.log("💻 https://github.com/simrail/EDR");
console.log("🐛 https://github.com/simrail/EDR/issues")
