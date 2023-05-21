import { StationConfig } from "../../config/stations";
import { Dictionary } from "lodash";
import { TrainTimeTableRow } from "../../Sirius";
import { ExtendedTrain } from "../../customTypes/ExtendedTrain";
import { differenceInMinutes } from "date-fns";

type ExtraStationConfig = {
    distanceToStation?: number,
    stationInternalId?: string,
    left?: string,
    right?: string,
    branchA?: string
    branchB?: string
}

export type ExtendedStationConfig = StationConfig & ExtraStationConfig;

export const getTrainDetails = (previousTrains: React.MutableRefObject<{[k: string]: DetailedTrain;} | null>, trainTimetables: Dictionary<TrainTimeTableRow[]>, dateNow: Date) =>(t: ExtendedTrain) => {
    const previousTrainData = previousTrains.current?.[t.TrainNoLocal as string];
    let lastDelay = previousTrainData?.lastDelay;
    if (previousTrainData?.TrainData && previousTrainData?.TrainData.VDDelayedTimetableIndex < t.TrainData.VDDelayedTimetableIndex) {
        const stationPassed = trainTimetables[t.TrainNoLocal]?.find(ttRow => ttRow.indexOfPoint === t.TrainData.VDDelayedTimetableIndex);
        if (stationPassed && dateNow) {
            lastDelay = differenceInMinutes(new Date(stationPassed.scheduledDepartureObject.getFullYear(), stationPassed.scheduledDepartureObject.getMonth(), stationPassed.scheduledDepartureObject.getDate(), dateNow.getHours(), dateNow.getMinutes()), stationPassed.scheduledDepartureObject);
        }
    }

    return {...t,
        timetable: trainTimetables[t.TrainNoLocal],
        lastDelay,
    } as DetailedTrain
}

type TrainDetails = {
    timetable: TrainTimeTableRow[],
    lastDelay?: number,
}

export type DetailedTrain = ExtendedTrain & TrainDetails;
