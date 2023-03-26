import axios from "axios";
import axiosRateLimit from 'axios-rate-limit';
import { BASE_AWS_API, BASE_SIMRAIL_API, srHeaders } from "./config.js";

const rlClient = axiosRateLimit(axios.create(), {maxRPS: 2});
const strictRlClient = axiosRateLimit(axios.create(), { perMilliseconds: 60000, maxRequests: 1 });

export const simrailClient = {
    get: (url: string, base_url = BASE_SIMRAIL_API) => {
        const URL = `${base_url}${url}`;
        console.info("Outbound request ", URL);
        // TODO: If this fails for any reason, the return value will be undefined which causes type-insecurity
        // Maybe handle exceptions one level above?
        return rlClient.get(URL, {
            headers: srHeaders
        });
    },
}

export const strictAwsSimrailClient = {
    get: (url: string, base_url = BASE_AWS_API) => {
        const URL = `${base_url}${url}`;
        console.info("Outbound request ", URL);
        // TODO: If this fails for any reason, the return value will be undefined which causes type-insecurity
        // Maybe handle exceptions one level above?
        return strictRlClient.get(URL, {
            headers: srHeaders
        });
    },
}
