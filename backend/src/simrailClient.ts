import axios from "axios";
import rl from 'axios-rate-limit';
import { BASE_SIMRAIL_API, srHeaders } from "./config";

const rlClient = rl(axios.create(), {maxRPS: 3});

export const simrailClient = {
    get: (url: string, base_url = BASE_SIMRAIL_API) => {
        try {
            const URL = `${base_url}${url}`;
            console.info("Outbound request ", URL);
            // TODO: If this fails for any reason, the return value will be undefined which causes type-insecurity
            // Maybe handle exceptions one level above?
            return rlClient.get(URL, {
                headers: srHeaders
            });
        } catch (e) {
            console.error("Simrail API is having problems ...");
        }
    },
}
