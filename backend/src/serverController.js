const simrailClient = require("./simrailClient");
const CONFIG = require("./config");

module.exports.getServerList = (req, res) => {
        return simrailClient.get("servers-open", CONFIG.BASE_SIMRAIL_API).then((e) => {
            return res.send(e.data.data);
        })
    };

module.exports.getStationsList = (req, res, serverCode) => {
    return simrailClient.get("stations-open?" + serverCode).then((e) => {
        return res.send(e.data.data);
    })
}