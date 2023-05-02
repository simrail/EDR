import _ from "lodash";
import { ISpeedLimit } from "../interfaces/ISpeedLimit.js";
import { IServerTrain } from "../interfaces/IServerTrain.js";
import { IFrontendTrainScheduleRow } from "../interfaces/IFrontendTrainScheduleRow.js";

export const getTrainTimetable = async (trainNumber: string, trainList: IServerTrain[], speedLimits: ISpeedLimit[]) => {
    // Group limits by line number to make searches easier
    const allSpeeds = _.groupBy(speedLimits, "lineNo");
    let trainTimeTable = trainList.find(trainData => trainData.trainNoLocal === trainNumber)?.timetable;
    if (trainTimeTable == undefined) return [];
    const isTheTrainNorthbound = Number.parseInt(trainNumber) % 2 === 0;

    const withDynamicData: IFrontendTrainScheduleRow[] = trainTimeTable.map((checkpoint, index, timeTable) => {
        const nextStationData = timeTable[index + 1];
        const allSpeedLimitsBetweenStationAndNextStation = allSpeeds[checkpoint.line]?.filter((speedLimit) => speedLimit.track === (isTheTrainNorthbound ? "N" : "P")).filter((speedLimit) => {
            return checkpoint.mileage == null || nextStationData?.mileage == null
                ? false
                : isTheTrainNorthbound ? speedLimit.axisStart < checkpoint.mileage && speedLimit.axisStart > nextStationData.mileage  :  speedLimit.axisStart > checkpoint.mileage && speedLimit.axisStart < nextStationData.mileage
        }) ?? [];
        return {
            ...checkpoint,
            actualArrivalObject: checkpoint.actualArrivalTime != null ? new Date(checkpoint.actualArrivalTime): new Date(0),
            actualDepartureObject: checkpoint.actualDepartureTime != null ? new Date(checkpoint.actualDepartureTime): new Date(3000, 12, 31),
            scheduledArrivalObject: checkpoint.arrivalTime != null ? new Date(checkpoint.arrivalTime): new Date(0),
            scheduledDepartureObject: checkpoint.departureTime != null ? new Date(checkpoint.departureTime): new Date(3000, 12, 31),
            speedLimitsToNextStation: allSpeedLimitsBetweenStationAndNextStation
        };
    })

    return _.sortBy(withDynamicData, 'indexOfPoint');
}
