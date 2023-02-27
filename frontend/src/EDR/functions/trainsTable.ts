import { TimeTableRow } from "..";

export const getTimetableStartingFromHour = (timetable: TimeTableRow[], startHour: string) => {      
    // Find the index of the first time in the timetable that is equal to or
    // greater than the start hour
    const startIndex = timetable.findIndex((time: TimeTableRow) => time.arrival_time >= startHour);
    
    if (startIndex === -1) {
      // If there is no time in the timetable that is equal to or greater than the
      // start hour, add the times from the beginning of the 24-hour period up to
      // (but not including) the start hour, as well as all times from the start
      // hour until the end of the 24-hour period
        return [
            ...timetable.slice(0, timetable.findIndex((time: TimeTableRow) => time.arrival_time === startHour)),
            ...timetable.slice(timetable.findIndex((time: TimeTableRow) => time.arrival_time === startHour))
        ];
    } else {
      // If there is a time in the timetable that is equal to or greater than the
      // start hour, return a new array that starts from the start index and
      // includes all times up to the end of the 24-hour period, as well as all
      // times from the beginning of the 24-hour period up to (but not including)
      // the start index
        return [
            ...timetable.slice(startIndex),
            ...timetable.slice(0, startIndex)
        ];
    }
}