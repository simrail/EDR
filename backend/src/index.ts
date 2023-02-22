import express from "express";
import morgan from "morgan";
import cors from "cors";
const app = express();
const Logger = morgan('short');

import {dispatchController, trainTimetableController} from "./dispatchController";
import {getPlayer, getServerList, getStationsList, getTrainsList} from "./serverController";

const corsConfig = {
    allowedHeaders: "x-debug",
    maxAge: 3600
};

// TODO: Consider using HelmetJS as well - https://helmetjs.github.io/
app.use(cors(corsConfig)).use(Logger);
app
    /*.set("etag", false)
    .set("Cache-control", "no-cache")*/
    .options('*', cors(corsConfig))
    .get("/", (req: express.Request, res: express.Response) => res.send("SR Community EDR !"))
    .get("/servers", getServerList)
    .get("/stations/:serverCode", (req: express.Request, res: express.Response) => getStationsList(req, res, req.params['serverCode']))
    .get("/trains/:serverCode", (req: express.Request, res: express.Response) => getTrainsList(req, res, req.params['serverCode']))
    .get("/dispatch/:post", dispatchController)
    .get("/train/:trainNo", trainTimetableController)
    .get("/dispatch/:serverCode/:post", dispatchController) // Temporary fallback for old client versions
    .get("/steam/:steamId", (req, res) => getPlayer(req, res, req.params['steamId']))
app.listen(8080)

console.log("🚆 Simrail Community EDR backend v1.0");
console.log("💻 https://github.com/simrail/EDR");
console.log("🐛 https://github.com/DKFN/edr-issues")
console.log("Steam API key ? ", !!process.env["STEAM_KEY"]);
