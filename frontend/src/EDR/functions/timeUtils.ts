import set from "date-fns/set";
import {nowUTC} from "../../utils/date";

const minutesInADay = 1440;

export const getDateWithHourAndMinutes = (expectedHours: number, expectedMinutes: number, tz: string) =>
    set(nowUTC(tz), {hours: expectedHours, minutes: expectedMinutes});

export const getTimeDelay = (isArrivalNextDay: boolean, isArrivalPreviousDay: boolean, dateNow: Date, expected: Date) =>
    ((isArrivalNextDay && dateNow.getHours() < 20 ? 1 : 0) * minutesInADay)
    + ((isArrivalNextDay && dateNow.getHours() > 20 ? 1 : 0) * -minutesInADay)
    + ((isArrivalPreviousDay && dateNow.getHours() > 20 ? 1 : 0) * minutesInADay)
    + ((isArrivalPreviousDay && dateNow.getHours() < 20 ? 1 : 0) * -minutesInADay)
    + ((dateNow.getHours() - expected.getHours()) * 60) + (dateNow.getMinutes() - expected.getMinutes());


