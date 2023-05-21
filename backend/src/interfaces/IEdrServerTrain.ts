import { IEdrTrainTimeTable } from "./IEdrTrainTimeTable.js";

export interface IEdrServerTrain {
    carrierName: string,
    endStation: string,
    isDangerousCargo: boolean,
    isHighRiskCargo: boolean,
    isOtherExceptional: boolean,
    isOverGauge: boolean,
    isOverWeight: boolean,
    isQualityTracked: boolean,
    ownNotes: string | null,
    startStation: string,
    timetable: IEdrTrainTimeTable[]
    trainName: string,
    trainNoLocal: string,
    usageNotes: string | null,
}
