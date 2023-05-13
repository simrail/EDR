import { IEdrServerTrain } from "./IEdrServerTrain";

export interface ICompleteTrainList {
    [x: string]: IEdrServerTrain[],
}
