import { ISpeedLimit } from "./ISpeedLimit";
import { IEdrTrainTimeTable } from "./IEdrTrainTimeTable";

export interface IFrontendTrainScheduleRow extends IEdrTrainTimeTable {
    actualArrivalObject: Date,
    actualDepartureObject: Date,
    scheduledArrivalObject: Date,
    scheduledDepartureObject: Date,
    speedLimitsToNextStation: ISpeedLimit[],
}