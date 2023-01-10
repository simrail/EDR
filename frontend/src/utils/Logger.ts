import {LOGGING} from "../config";

export const console_log = (...args: any[]) => LOGGING && console.log(...args);