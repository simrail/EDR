import _ from "lodash";
import { IServerTrain } from "../interfaces/IServerTrain.js";
import { IFrontendStationTrainRow } from "../interfaces/IFrontendStationTrainRow.js";

export const getStationTimetable = async (stationId: string, trainList: IServerTrain[]) => {
    const trainsForStation = trainList.filter(train => train.timetable.some(checkpoint => checkpoint.pointId === stationId));
    const withDynamicData: IFrontendStationTrainRow[] = trainsForStation.map((train) => {
        const stationEntry = train.timetable.find(checkpoint => checkpoint.pointId === stationId);
        if (stationEntry == undefined) {
            return {} as IFrontendStationTrainRow;
        }
        
        const stationIndex = train.timetable.findIndex(checkpoint => checkpoint.pointId === stationId);
        let previousEntry = null;
        if (stationIndex > 0) {
            previousEntry = train.timetable[stationIndex - 1];
        }
        let nextEntry = null;
        if (stationIndex < train.timetable.length - 1) {
            nextEntry = train.timetable[stationIndex + 1];
        }

        return {
            trainNumber: train.trainNoLocal,
            trainType: stationEntry.trainType,
            stopType: stationEntry.stopTypeNumber,
            track: stationEntry.track,
            platform: stationEntry.platform,
            arrivalTimeObject: stationEntry.arrivalTime != null ? new Date(stationEntry.arrivalTime): new Date(0),
            departureTimeObject: stationEntry.departureTime != null ? new Date(stationEntry.departureTime): new Date(3000, 12, 31),
            typeSpeed: stationEntry.maxSpeed,
            fromPost: previousEntry?.nameForPerson,
            fromPostId: previousEntry?.pointId,
            toPost: nextEntry?.nameForPerson,
            toPostId: nextEntry?.pointId,
            line: stationEntry.line,
            startStation: train.startStation,
            terminusStation: train.endStation,
            layover: stationEntry.plannedStop,
            pointId: stationEntry.pointId,
            stationIndex: stationEntry.indexOfPoint
        };
    });

    return _.sortBy(withDynamicData, 'arrivalTimeObject');
}