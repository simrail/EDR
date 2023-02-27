import utcToZonedTime from 'date-fns-tz/utcToZonedTime'
import  {addHours} from "date-fns";

export const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
};
 // TODO: Take UTC offset from API now. And then shift the hours by the UTC offset value instead of taking TZ
export const nowUTC = (serverTzOffset: number = 0, addDelay?: number) => {
    const now = new Date();
    return addHours(utcToZonedTime(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() ,
        addDelay ? now.getUTCHours() - addDelay : now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()), "Europe/London"), serverTzOffset)
}

// We don't care about the date, only time
export const formatTime = (date: Date, language: string, options?: Intl.DateTimeFormatOptions) => {
    if (!(date instanceof Date)) {
		return '-';
	}
	return date.toLocaleTimeString(language, options);
}
