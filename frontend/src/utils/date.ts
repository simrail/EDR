import {utcToZonedTime, zonedTimeToUtc} from 'date-fns-tz'

export const nowUTC = (targetTimezone: string = "Europe/Paris") => {
    const now = new Date();
    return utcToZonedTime(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() ,
        now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()), targetTimezone)
}