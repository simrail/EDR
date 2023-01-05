const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Logger = morgan('short');

const dispatchController = require("./dispatchController").default;
const serverController = require("./serverController");

const corsConfig = {
    allowedHeaders: "x-debug",
    maxAge: 3600
};

app.use(cors(corsConfig)).use(Logger);

app
    /*.set("etag", false)
    .set("Cache-control", "no-cache")*/
    .options('*', cors(corsConfig))
    .get("/", (req, res) => res.send("Better dispatch !"))
    .get("/servers", serverController.getServerList)
    .get("/stations/:serverCode", (req, res) => serverController.getStationsList(req, res, req.params['serverCode']))
    .get("/trains/:serverCode", (req, res) => serverController.getTrainsList(req, res, req.params['serverCode']))
    .get("/dispatch/:serverCode/:post", dispatchController)
app.listen(8080)