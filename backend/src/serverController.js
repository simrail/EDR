const simrailClient = require("./simrailClient");
const CONFIG = require("./config");

module.exports.getServerList = (req, res) => {
        return simrailClient.get("servers-open", CONFIG.BASE_SIMRAIL_API).then((e) => {
            return res
                .setHeader("Cache-control", 'public, max-age=3600')
                .send(e.data.data);
        })
    };

module.exports.getStationsList = (req, res, serverCode) => {
    return simrailClient.get("stations-open?serverCode=" + serverCode).then((e) => {
        return res
            .setHeader("Cache-control", 'public, max-age=3600')
            .send(e.data.data);
    })
}

module.exports.getTrainsList = (req, res, serverCode) => {
    return simrailClient.get("trains-open?serverCode=" + serverCode).then((e) => {
        return res
            .setHeader("Cache-control", 'public, max-age=10, must-revalidate, stale-if-error=30')
            .send(e.data.data);
    })
}