import { IEdrTrainTimeTable } from "./IEdrTrainTimeTable.js";

export interface IAllServerTrain {
    trainNoLocal: string,
    trainNoInternational: string,
    trainName: string,
    startStation: string,
    endStation: string,
    startsAt: string,
    endsAt: string,
    locoType: string,
    trainLength: number,
    trainWeight: number,
    continuesAs: string,
    timetable: IEdrTrainTimeTable[]
}
