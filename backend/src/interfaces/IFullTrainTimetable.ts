import { IAllTrainTimeTable } from "./IAllTrainTimeTable";
import { IEdrTrainTimeTable } from "./IEdrTrainTimeTable";

export interface IFullTrainTimetable extends IAllTrainTimeTable, IEdrTrainTimeTable {}