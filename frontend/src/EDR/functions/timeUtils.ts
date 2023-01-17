import set from "date-fns/set";
import {nowUTC} from "../../utils/date";

export const getDateWithHourAndMinutes = (expectedHours: number, expectedMinutes: number, tz: string) =>
    set(nowUTC(tz), {hours: expectedHours, minutes: expectedMinutes});

export const getTimeDelay = (isNextDay: boolean, isPreviousDay: boolean, dateNow: Date, expected: Date) =>
    ((isNextDay && dateNow.getHours() < 22 ? 1 : 0) * -1444) + ((isPreviousDay && dateNow.getHours() < 22 ? 1 : 0) * (1444 * 2)) + ((dateNow.getHours() - expected.getHours()) * 60) + (dateNow.getMinutes() - expected.getMinutes());

