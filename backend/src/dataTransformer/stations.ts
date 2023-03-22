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
            train_number: train.trainNoLocal,
            train_type: stationEntry.trainType,
            stop_type: stationEntry.stopTypeNumber,
            track: stationEntry.track,
            platform: stationEntry.platform,
            arrival_time_object: stationEntry.arrivalTime != null ? new Date(stationEntry.arrivalTime): new Date(0),
            arrival_time: stationEntry.arrivalTime?.split(' ')[1].substring(0, 5),
            departure_time: stationEntry.departureTime?.split(' ')[1].substring(0, 5),
            type_speed: stationEntry.maxSpeed,
            from_post: previousEntry?.nameForPerson,
            from_post_id: previousEntry?.pointId,
            to_post: nextEntry?.nameForPerson,
            to_post_id: nextEntry?.pointId,
            line: stationEntry.line,
            start_station: train.startStation,
            terminus_station: train.endStation,
            layover: stationEntry.plannedStop,
            pointId: stationEntry.pointId
        };
    });

    return _.sortBy(withDynamicData, 'arrival_time_object');
}