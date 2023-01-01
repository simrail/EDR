const axios = require("axios");
const rl = require('axios-rate-limit');
const CONFIG = require("./config");
const rlClient = rl(axios.create(), {maxRPS: 1});

module.exports = {
    get: (url, base_url = CONFIG.BASE_SIMRAIL_API) => {
        try {
            const URL = `${base_url}${url}`;
            console.info("Outbound request ", URL);
            return rlClient.get(URL, {
                headers: CONFIG.srHeaders
            }) } catch (e) {
            console.error("Simrail API is having problems ...");
        }
    },
}
