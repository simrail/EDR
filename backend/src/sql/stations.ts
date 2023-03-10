import connPool from "../sqlPool";
import _ from "lodash";
import fs from "node:fs";
import {VMAX_BY_TYPE} from "../config";

export const getStationTimetable = async (stationId: string) => {
    const stationTimetableRows = await connPool.query(`
    SELECT
        train_number,
        train_type,
        type_speed,
        stop_type,
        platform,
        arrival_time,
        departure_time,
        arrival_date,
        departure_date,
        from_post,
        to_post,
        line,
        start_station,
        terminus_station,
        layover,
        cacheDate
    FROM stations_timetable_row WHERE simrail_new_edr_station_id=$1
    `, [stationId]).then((r) => r.rows)

    console.log("Stations timetable rows : ", stationTimetableRows);

    const withDynamicData = stationTimetableRows.map((row) => {
        return _.omit({
            ...row,
            type_speed: VMAX_BY_TYPE[row.train_type],
            hourSort: Number.parseInt(`${row.arrival_time.split(':')[0]}${row.arrival_time.split(':')[1]}`),
        }, ['arrival_date', 'departure_date']);
    })

    return _.sortBy(withDynamicData, 'hourSort');
}