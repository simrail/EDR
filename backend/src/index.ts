import express from "express";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
const app = express();
const Logger = morgan('short');

import {dispatchController, trainTimetableController} from "./dispatchController.js";
import {getServerList, getStationsList, getTrainsList, getServerTz, getPlayer} from "./serverController.js";
import helmet from "helmet";

const corsConfig: CorsOptions = {
    allowedHeaders: "content-type",
    maxAge: 3600
};

app.use(cors(corsConfig)).use(Logger).use(helmet()).use(express.json());
app
    /*.set("etag", false)
    .set("Cache-control", "no-cache")*/
    .options('*', cors(corsConfig))
    .get("/", (req: express.Request, res: express.Response) => res.send("Simrail Community EDR"))
    .get("/servers", getServerList)
    .get("/server/tz/:serverCode", getServerTz)
    .get("/stations/:serverCode", (req: express.Request, res: express.Response) => getStationsList(req, res, req.params['serverCode']))
    .get("/trains/:serverCode", (req: express.Request, res: express.Response) => getTrainsList(req, res, req.params['serverCode']))
    .get("/dispatch/:post", dispatchController)
    .get("/train/:trainNo", trainTimetableController)
    .get("/steam/:steamId", getPlayer);
app.listen(process.env.LISTEN_PORT);

console.log("🚆 Simrail Community EDR backend v2.0-alpha");
console.log("💻 https://github.com/simrail/EDR");
console.log("🐛 https://github.com/simrail/EDR/issues")
