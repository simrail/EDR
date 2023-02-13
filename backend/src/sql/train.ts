import connPool from "../sqlPool";

import _ from "lodash";

export const getTrainTimetable = async (trainNumber: string) => {
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

    console.log("Row : ", data)

    const withDynamicData = data.map((row) => {
        return _.omit({
            ...row,
            hourSort: row.scheduled_arrival_hour ? Number.parseInt(`${row.scheduled_arrival_hour.split(':')[0]}${row.scheduled_arrival_hour.split(':')[1]}`) : 0
        }, ['scheduled_arrival', 'real_arrival', 'real_arrival_hour', 'real_departure', 'real_departure_hour']);
    })

    return _.sortBy(withDynamicData, 'hourSort');
}