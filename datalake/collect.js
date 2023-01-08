const fetch = require("axios");
const redis = require("redis");
const client = redis.createClient();

async function a() {
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();

    const servers = ['fr1', 'fr2', 'cz1'];

    setInterval(() => {
        console.log("Polling for data : ");
        servers.map((sc) => fetch("https://dispatch-api.cdn.infra.deadlykungfu.ninja/trains/"+sc).then((res) => {
            client.HSET('trains_'+sc, Date.now().toString(10), JSON.stringify(res.data)).then(() => {
                console.log("Written in redis " + sc);
            })
        }));
    }, 12000);
}

a();