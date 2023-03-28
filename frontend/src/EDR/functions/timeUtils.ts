import { addDays, differenceInMinutes, subDays } from "date-fns";
import set from "date-fns/set";

export const getDateWithHourAndMinutes = (dateNow: Date, expectedHours: number, expectedMinutes: number, isArrivalNextDay: boolean, isArrivalPreviousDay: boolean) => {
    if (isArrivalNextDay) {
        return set(addDays(dateNow, 1), {hours: expectedHours, minutes: expectedMinutes})
    } else if (isArrivalPreviousDay) {
        return set(subDays(dateNow, 1), {hours: expectedHours, minutes: expectedMinutes})
    } else {
        return set(dateNow, {hours: expectedHours, minutes: expectedMinutes});
    }
}

export const getTimeDelay = (dateNow: Date, expected: Date) =>
    differenceInMinutes(dateNow, expected);
