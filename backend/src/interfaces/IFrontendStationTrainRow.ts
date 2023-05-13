import { IEdrServerTrain } from "./IEdrServerTrain";

export interface IFrontendStationTrainRow extends Omit<IEdrServerTrain, 'timetable'> {
    trainType: string,
    stopType: number,
    track: number | null,
    platform: string | null,
    actualArrivalObject: Date,
    actualDepartureObject: Date,
    scheduledArrivalObject: Date,
    scheduledDepartureObject: Date,
    maxSpeed: number,
    fromPost: string | undefined,
    fromPostId: string | undefined,
    toPost: string | undefined,
    toPostId: string | undefined,
    line: number,
    plannedStop: number,
    pointId: string,
    stationIndex: number,
}