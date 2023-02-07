const pg = require("pg");
const process = require("node:process");
const express = require("express");
const {scrapMap} = require("./scrapper");
const app = express();

const pgClient = new pg.Client({
    host: "127.0.0.1",
    user: "postgres",
    password: "mysecretpassword",
    port: 1445
});

pgClient.connect((err) => {
    if (err) {
        console.error("Unable to connect to postgresql instance !")
        console.error(err);
    } else {
        console.log("Connected to PostGresql !");
    }
})

const isStationInDatabase = (stationName) => {
    return pgClient.query("SELECT * from stations WHERE name=$1", [stationName])
        .then((v) => v.rows.length > 0)
        .catch(console.error);
}

const insertStationInDb = (stationConfig) => {
    return pgClient.query("INSERT INTO stations (name, cacheDate) VALUES ($1, $2)", [stationConfig.Name, new Date()])
        .then(() => console.log("Station added !"))
        .catch((e) => console.error("Error while adding station", e))
}

function processStations(req, res) {
    console.log("Station processing starting ...");
    fetch("https://dispatch-api.cdn.infra.deadlykungfu.ninja/stations/fr1").then((res) => {
        res.json().then((d) => {
            d.map((stationConfig) => {
                isStationInDatabase(stationConfig.Name).then(isInStation => {
                    if (!isInStation) {
                        insertStationInDb(stationConfig)
                    }
                })
            })
        });
    })
    res.send("Processing started");
}

function processPost(req, res) {

}

app.get("/process/stations", processStations)

scrapMap();

app.listen(8080)

process.on('exit', () => {
    console.log("Closing PG connection. Bye bye !\n");
    pgClient.close();
})
