import _ from "lodash";
import { IEdrServerTrain } from "../interfaces/IEdrServerTrain.js";
import { IFrontendStationTrainRow } from "../interfaces/IFrontendStationTrainRow.js";

export const getStationTimetable = async (stationId: number, trainList: IEdrServerTrain[]) => {
    const trainsForStation = trainList.filter(train => train.timetable.some(checkpoint => parseInt(checkpoint.pointId) === stationId));
    const withDynamicData: Promise<IFrontendStationTrainRow>[] = trainsForStation.map(async (train) => {
        const stationEntry = train.timetable.find(checkpoint => parseInt(checkpoint.pointId) === stationId);
        if (stationEntry == undefined) {
            return {} as IFrontendStationTrainRow;
        }

        const stationIndex = train.timetable.findIndex(checkpoint => parseInt(checkpoint.pointId) === stationId);
        let previousEntry = null;
        if (stationIndex > 0) {
            previousEntry = train.timetable[stationIndex - 1];
        }

        let nextEntry = null;
        if (stationIndex < train.timetable.length - 1) {
            nextEntry = train.timetable[stationIndex + 1];
        }

        return {
            ..._.omit(train, 'timetable'),
            trainType: stationEntry.trainType,
            stopType: stationEntry.stopTypeNumber,
            track: stationEntry.track,
            platform: stationEntry.platform,
            actualArrivalObject: stationEntry.actualArrivalTime != null ? new Date(stationEntry.actualArrivalTime) : new Date(0),
            actualDepartureObject: stationEntry.actualDepartureTime != null ? new Date(stationEntry.actualDepartureTime) : new Date(3000, 12, 31),
            scheduledArrivalObject: stationEntry.arrivalTime != null ? new Date(stationEntry.arrivalTime) : new Date(0),
            scheduledDepartureObject: stationEntry.departureTime != null ? new Date(stationEntry.departureTime) : new Date(3000, 12, 31),
            maxSpeed: stationEntry.maxSpeed,
            fromPost: previousEntry?.nameForPerson,
            fromPostId: previousEntry?.pointId,
            toPost: nextEntry?.nameForPerson,
            toPostId: nextEntry?.pointId,
            line: stationEntry.line,
            plannedStop: stationEntry.plannedStop,
            pointId: stationEntry.pointId,
            stationIndex: stationEntry.indexOfPoint,
        };
    });

    return Promise.all(withDynamicData).then(result => _.sortBy(result, 'scheduledArrivalObject'));
}