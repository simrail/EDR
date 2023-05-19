import axios from "axios";
import axiosRateLimit from 'axios-rate-limit';
import { BASE_AWS_API, BASE_SELF_API, BASE_SIMKOL_API, BASE_SIMRAIL_API, srHeaders } from "./config.js";
import { ISpeedLimitApi } from "./interfaces/ISpeedLimitApi.js";

const rlClient = axiosRateLimit(axios.create(), {maxRPS: 2});
const strictRlClient = axiosRateLimit(axios.create(), { perMilliseconds: 2000, maxRequests: 1 });
const selfRlClient = axiosRateLimit(axios.create(), {maxRPS: 100});

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

/** This is for getting the FULL SERVER TIMETABLE */
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

export const simkolClient = {
    get: (url: string, base_url = BASE_SIMKOL_API) => {
        const URL = `${base_url}${url}`;
        console.info("Outbound request ", URL);
        // TODO: If this fails for any reason, the return value will be undefined which causes type-insecurity
        // Maybe handle exceptions one level above?
        return rlClient.get<ISpeedLimitApi[]>(URL, {
            headers: srHeaders
        });
    },
}

export const selfClient = {
    get: (url: string, base_url = BASE_SELF_API) => {
        const URL = `${base_url}${url}`;
        console.info("Outbound request ", URL);
        // TODO: If this fails for any reason, the return value will be undefined which causes type-insecurity
        // Maybe handle exceptions one level above?
        return selfRlClient.get(URL, {
            headers: srHeaders
        });
    },
}
