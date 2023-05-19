import { IAllServerTrain } from "./IAllServerTrain";
import { IEdrServerTrain } from "./IEdrServerTrain";
import { IFullTrainTimetable } from "./IFullTrainTimetable";

export interface IFullServerTrain extends IAllServerTrain, IEdrServerTrain {
    timetable: IFullTrainTimetable[];
}