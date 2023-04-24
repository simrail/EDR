import { ISpeedLimit } from "./ISpeedLimit";
import { ITrainTimeTable } from "./ITrainTimeTable";

export interface IFrontendTrainScheduleRow extends ITrainTimeTable {
    actualArrivalObject: Date,
    actualDepartureObject: Date,
    scheduledArrivalObject: Date,
    scheduledDepartureObject: Date,
    speedLimitsToNextStation: ISpeedLimit[],
}