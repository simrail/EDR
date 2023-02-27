import express from "express";
import morgan from "morgan";
import cors from "cors";
const app = express();
const Logger = morgan('short');

import "./srTimetableApi";

import {dispatchController, trainTimetableController} from "./dispatchController";
import {getPlayer, getServerList, getStationsList, getTrainsList, getServerTz} from "./serverController";
import {fetchTimetableDataAndWriteIt} from "./srTimetableApi";

const corsConfig = {
    allowedHeaders: "x-debug",
    maxAge: 3600
};

app.use(cors(corsConfig)).use(Logger);
fetchTimetableDataAndWriteIt().then(() =>  {
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
        .get("/dispatch/:serverCode/:post", dispatchController) // Temporary fallback for old client versions
        .get("/steam/:steamId", (req, res) => getPlayer(req, res, req.params['steamId']))
        .get("/test/dispatch", (req, res) => res.send((global as any).stationsTimetables))
        .get("/test/trains", (req, res) => res.send((global as any).trainData))
    app.listen(8080)

    console.log("🚆 Simrail Community EDR backend v1.3");
    console.log("💻 https://github.com/simrail/EDR");
    console.log("🐛 https://github.com/simrail/EDR/issues")
    console.log("Steam API key ? ", !!process.env["STEAM_KEY"]);
});

// TODO: Consider using HelmetJS as well - https://helmetjs.github.io/
