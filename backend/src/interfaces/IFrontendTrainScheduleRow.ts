import { ISpeedLimit } from "./ISpeedLimit";

export interface IFrontendTrainScheduleRow {
    train_number: string,
    scheduled_arrival_hour: string | undefined,
    station: string,
    layover: string,
    km: number,
    scheduled_departure_hour: string | undefined,
    train_type: string,
    line: string,
    stop_type: number,
    speedLimitsToNextStation: ISpeedLimit[]
}