import { ISpeedLimit } from "./ISpeedLimit";

export interface IFrontendTrainScheduleRow {
    trainNumber: string,
    scheduledArrivalObject: Date,
    station: string,
    layover: number,
    km: number,
    scheduledDepartureObject: Date,
    trainType: string,
    line: number,
    stopType: number,
    pointId: string,
    speedLimitsToNextStation: ISpeedLimit[],
}