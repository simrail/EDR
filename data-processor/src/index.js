const SIMRAIL_EDR_URL = process.env["SIMRAIL_EDR_URL"];
const pg = require("pg");

const pgClient = new pg.Client({
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
        main();
    }
})

function main() {
    console.log("Data processor is starting ...");

    fetch("https://dispatch-api.cdn.infra.deadlykungfu.ninja/stations/fr1").then((res) => {
        res.json().then((d) => {
            console.log("Data :", d);
        });
    })
}
