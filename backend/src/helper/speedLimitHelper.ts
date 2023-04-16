import { ISpeedLimit } from "../interfaces/ISpeedLimit";
import { ISpeedLimitApi } from "../interfaces/ISpeedLimitApi";

export function ConvertSpeedsApiToInternal(speeds: ISpeedLimitApi[]): ISpeedLimit[] {
    return speeds.map(speedLimit => {
        return {
            ...speedLimit,
            axisStart: Number.parseInt(speedLimit.axisStart) / 1000,
            axisEnd: Number.parseInt(speedLimit.axisEnd) / 1000,
            vMax: Number.parseInt(speedLimit.vMax)
        };
    });
}