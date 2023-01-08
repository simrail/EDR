import express from "express";
import morgan from "morgan";
import cors from "cors";
const app = express();
const Logger = morgan('short');

import { dispatchController } from "./dispatchController";
import { getServerList, getStationsList, getTrainsList } from "./serverController";

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
    .get("/", (req, res) => res.send("Better dispatch !"))
    .get("/servers", getServerList)
    .get("/stations/:serverCode", (req, res) => getStationsList(req, res, req.params['serverCode']))
    .get("/trains/:serverCode", (req, res) => getTrainsList(req, res, req.params['serverCode']))
    .get("/dispatch/:serverCode/:post", dispatchController)
app.listen(8080)