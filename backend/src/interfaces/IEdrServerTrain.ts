import { IEdrTrainTimeTable } from "./IEdrTrainTimeTable.js";

export interface IEdrServerTrain {
    trainNoLocal: string,
    trainName: string,
    startStation: string,
    endStation: string,
    usageNotes: string | null,
    ownNotes: string | null,
    isQualityTracked: boolean,
    isOverGauge: boolean,
    isOverWeight: boolean,
    isOtherExceptional: boolean,
    isHighRiskCargo: boolean,
    isDangerousCargo: boolean,
    carrierName: string,
    timetable: IEdrTrainTimeTable[]
}
