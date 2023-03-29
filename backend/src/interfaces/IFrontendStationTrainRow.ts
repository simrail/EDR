import { IServerTrain } from "./IServerTrain";

export interface IFrontendStationTrainRow extends Omit<IServerTrain, 'timetable'> {
    trainType: string,
    stopType: number,
    track: number | null,
    platform: string | null,
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
    stationIndex: number
}