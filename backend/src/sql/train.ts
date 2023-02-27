import connPool from "../sqlPool";

import _ from "lodash";
import fs from "node:fs";

const stationsMileage = JSON.parse(fs.readFileSync("src/mileage.json", "utf8"));
const _allSpeeds = fetch("https://webhost.simkol.pl/speeds.json").then(r => r.json()).then((d) => d.map((d: any) => {
    return {
        ...d,
        axisStart: Number.parseInt(d.axisStart) / 1000,
        axisEnd: Number.parseInt(d.axisEnd) / 1000,
    }
}))
export const getTrainTimetable = async (trainNumber: string) => {
    const allSpeeds = await (_allSpeeds.then((as) => _.groupBy(as, "lineNo")));
    const data = await connPool.query(`
        SELECT
            train_number,
            scheduled_arrival,
            scheduled_arrival_hour,
            real_arrival,
            real_arrival_hour,
            station,
            layover,
            scheduled_departure_hour,
            real_departure,
            real_departure_hour,
            train_type,
            line,
            cacheDate,
            stop_type
        FROM trains_timetable_row WHERE train_number=$1
    `, [trainNumber]).then((r) => r.rows);

    const isTheTrainNorthbound = Number.parseInt(trainNumber) % 2 === 0;

    const withDynamicData = data.map((row, index) => {
        // TODO: Find the next station that is not null instead of doing that
        const currentStationKM = stationsMileage[row.line]?.[row.station];
        const nextStationData = data[index + 1]
        const nextStationKM = nextStationData?.station ? stationsMileage[row.line]?.[nextStationData?.station] : undefined;
        const allSpeedLimitsBetweenStationAndNextStations = allSpeeds[row.line]?.filter((sl) => sl.track === (isTheTrainNorthbound ? "N" : "P")).filter((sl) => {
            return currentStationKM === null || nextStationKM === null
                ? false
                : isTheTrainNorthbound ? sl.axisStart < currentStationKM && sl.axisStart > nextStationKM  :  sl.axisStart > currentStationKM && sl.axisStart < nextStationKM
        }) ?? [];
        return _.omit({
            ...row,
            hourSort: row.scheduled_arrival_hour ? Number.parseInt(`${row.scheduled_arrival_hour.split(':')[0]}${row.scheduled_arrival_hour.split(':')[1]}`) : 0,
            km: stationsMileage[row.line]?.[row.station],
            speedLimitsToNextStation: allSpeedLimitsBetweenStationAndNextStations
        }, ['scheduled_arrival', 'real_arrival', 'real_arrival_hour', 'real_departure', 'real_departure_hour']);
    })

    console.log('All speeds : ', allSpeeds);

    return _.sortBy(withDynamicData, 'hourSort');
}