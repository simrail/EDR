import { ISpeedLimit } from "./ISpeedLimit";
import { ITrainTimeTable } from "./ITrainTimeTable";

export interface IFrontendTrainScheduleRow extends ITrainTimeTable {
    scheduledArrivalObject: Date,
    scheduledDepartureObject: Date,
    speedLimitsToNextStation: ISpeedLimit[],
}