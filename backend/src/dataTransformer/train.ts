import _ from "lodash";
import fs from "fs";
import axios from "axios";
import { ISpeedLimitApi } from "../interfaces/ISpeedLimitApi.js";
import { ISpeedLimit } from "../interfaces/ISpeedLimit.js";
import { IServerTrain } from "../interfaces/IServerTrain.js";
import { ITrainTimeTable } from "../interfaces/ITrainTimeTable.js";
import { BASE_SIMKOL_API } from "../config.js";
import { IFrontendTrainScheduleRow } from "../interfaces/IFrontendTrainScheduleRow.js";

// TODO: Instead of getting whole timetable, chop this data into smaller chunks
const trainList = JSON.parse(fs.readFileSync("official-edr-data.json", "utf8")) as IServerTrain[];
const speedLimits: Promise<ISpeedLimit[]> = axios.get<ISpeedLimitApi[]>(`${BASE_SIMKOL_API}/speeds.json`).then((result) => result.data.map(speedLimit => {
    return {
        ...speedLimit,
        axisStart: Number.parseInt(speedLimit.axisStart) / 1000,
        axisEnd: Number.parseInt(speedLimit.axisEnd) / 1000,
        vMax: Number.parseInt(speedLimit.vMax)
    };
}));

export const getTrainTimetable = async (trainNumber: string) => {
    // Group limits by line number to make searches easier
    const allSpeeds = await (speedLimits.then((limit) => _.groupBy(limit, "lineNo")));
    let trainTimeTable = trainList.find(trainData => trainData.trainNoLocal === trainNumber)?.timetable;
    if (trainTimeTable == undefined) return [];
    const isTheTrainNorthbound = Number.parseInt(trainNumber) % 2 === 0;

    const withDynamicData: IFrontendTrainScheduleRow[] = trainTimeTable.map((checkpoint, index, timeTable) => {
        // TODO: Find the next station that is not null instead of doing that
        const nextStationData = timeTable[index + 1];
        const allSpeedLimitsBetweenStationAndNextStation = allSpeeds[checkpoint.line]?.filter((speedLimit) => speedLimit.track === (isTheTrainNorthbound ? "N" : "P")).filter((speedLimit) => {
            return checkpoint.mileage == null || nextStationData?.mileage == null
                ? false
                : isTheTrainNorthbound ? speedLimit.axisStart < checkpoint.mileage && speedLimit.axisStart > nextStationData.mileage  :  speedLimit.axisStart > checkpoint.mileage && speedLimit.axisStart < nextStationData.mileage
        }) ?? [];
        return {
            train_number: checkpoint.displayedTrainNumber,
            scheduled_arrival_hour: checkpoint.arrivalTime?.split(' ')[1].substring(0, 5),
            station: checkpoint.nameForPerson,
            layover: checkpoint.stopDuration.toString(),
            km: checkpoint.mileage,
            scheduled_departure_hour: checkpoint.departureTime?.split(' ')[1].substring(0, 5),
            train_type: checkpoint.trainType,
            line: checkpoint.line.toString(),
            stop_type: checkpoint.stopTypeNumber,
            speedLimitsToNextStation: allSpeedLimitsBetweenStationAndNextStation
        };
    })

    return _.sortBy(withDynamicData, 'indexOfPoint');
}
