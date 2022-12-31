const axios = require("axios");
const rl = require('axios-rate-limit');
const CONFIG = require("./config");
const rlClient = rl(axios.create(), {maxRPS: 5});

module.exports = {
    get: (url, base_url = CONFIG.BASE_SIMRAIL_API) => rlClient.get(`${base_url}${url}`, {
        headers: CONFIG.srHeaders
    }),
}
