import express from "express";
import morgan from "morgan";
import cors from "cors";
const app = express();
const Logger = morgan('short');

import {dispatchController, trainTimetableController, trainTimetableListController} from "./dispatchController.js";
import {getPlayer, getServerList, getStationsList, getTrainsList, getServerTz} from "./serverController.js";
import helmet from "helmet";

const corsConfig = {
    allowedHeaders: "x-debug",
    maxAge: 3600
};

app.use(cors(corsConfig)).use(Logger).use(helmet()).use(express.json());
app
    /*.set("etag", false)
    .set("Cache-control", "no-cache")*/
    .options('*', cors(corsConfig))
    .get("/", (req: express.Request, res: express.Response) => res.send("SR Community EDR !"))
    .get("/servers", getServerList)
    .get("/server/tz/:serverCode", getServerTz)
    .get("/stations/:serverCode", (req: express.Request, res: express.Response) => getStationsList(req, res, req.params['serverCode']))
    .get("/trains/:serverCode", (req: express.Request, res: express.Response) => getTrainsList(req, res, req.params['serverCode']))
    .get("/dispatch/:post", dispatchController)
    .get("/train/:trainNo", trainTimetableController)
    .post("/train/batch", trainTimetableListController)
    .get("/dispatch/:serverCode/:post", dispatchController) // Temporary fallback for old client versions
    .get("/steam/:steamId", getPlayer);
app.listen(8080);

console.log("🚆 Simrail Community EDR backend v2.0-alpha");
console.log("💻 https://github.com/simrail/EDR");
console.log("🐛 https://github.com/simrail/EDR/issues")
