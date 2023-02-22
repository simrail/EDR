const pg = require("pg");
const process = require("node:process");
const express = require("express");
const {scrapMap} = require("./scrapper");
const app = express();

const SR_STATIONS_IDS = [{
    id: 1655, // KZ
    fetchTrains: false
},  {
    id: 3991, // SG 52
    fetchTrains: true
}, {
    id: 3993, // SG
    fetchTrains: false
}, {
    id: 124, // BZ
    fetchTrains: false
}, {
    id: 719, // DG
    fetchTrains: false
}, {
    id: 2375, // LZ_LC
    fetchTrains: true
}, {
    id: 1193, // GW
    fetchTrains: false
}, {
    id: 3436, // PS
    fetchTrains: false
}, {
    id: 1772, // KN
    fetchTrains: true
}, {
    id: 4987, // WP
    fetchTrains: true
}, {
    id: 2969, // OZ
    fetchTrains: false
}, {
    id: 3200, // PI
    fetchTrains: false
}, {
    id: 2993, // OP_PO
    fetchTrains: false
}, {
    id: 5262, // ZW
    fetchTrains: true
}, {
    id: 733, // DGW
    fetchTrains: true
}, {
    id: 4010, // SP
    fetchTrains: false
}, {
    id: 1349, // IDZ
    fetchTrains: true
}]

const pgClient = new pg.Client({
    host: process.env["PG_HOST"] ?? "127.0.0.1",
    user: process.env["PG_USER"] ?? "postgres",
    password: process.env["PG_PWD"] ?? "mysecretpassword",
    port: process.env["PG_PORT"] ?? 1445
});

pgClient.connect((err) => {
    if (err) {
        console.error("Unable to connect to postgresql instance !")
        console.error(err);
    } else {
        console.log("Connected to Postgres [DOCKER DEV] !");
    }
})

global.pgClient = pgClient;

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

const fn = async () => {
    for (let i = 0; i < SR_STATIONS_IDS.length; i++) {
        try {
            const id = SR_STATIONS_IDS[i].id
            console.log("Scrapping starting ", new Date());
            await scrapMap("stations", id);
            console.log("Stations finished ", new Date());
            if (SR_STATIONS_IDS[i].fetchTrains)
                await scrapMap("trains", id);
            console.log("Trains finished ", new Date());
        } catch (e) {
            console.error("Scrapping failed ", new Date());
            console.error("Scrapping failed ", e)
            if (global.scrapBrowser) {
                await global.scrapBrowser.close();
            }
        }
    }
}

const mainInterval = setInterval(fn, 1800 * 1000)

fn();
// scrapMap();

app.listen(8080)

process.on('exit', () => {
    console.log("Closing DB connection. Bye bye !\n");
    pgClient.end();
})
