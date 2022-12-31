const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Logger = morgan('tiny');

const dispatchController = require("./dispatchController").default;
const serverController = require("./serverController");
app.use(cors()).use(Logger);

app
    .set("etag", false)
    .get("/", (req, res) => res.send("Better dispatch !"))
    .get("/servers", serverController.getServerList)
    //.get("/stations/:serverCode")
    .get("/dispatch/:serverCode/:post", dispatchController)
app.listen(8080)