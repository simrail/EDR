import { addHours } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
};

export const nowUTC = (serverTime: number | undefined, serverTzOffset: number) => {
    let now: Date;
    if (serverTime === undefined) {
        now = new Date();
    } else {
        now = new Date(serverTime);
    }

    return addHours(utcToZonedTime(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate(),
            now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()), "GMT"), serverTzOffset);
}

// We don't care about the date, only time
export const formatTime = (date: Date, language: string, options?: Intl.DateTimeFormatOptions) => {
    if (!(date instanceof Date)) {
		return '-';
	}
	return date.toLocaleTimeString(language, options);
}
