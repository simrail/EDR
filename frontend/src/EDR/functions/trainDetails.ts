import _minBy from "lodash/fp/minBy";
import {console_log} from "../../utils/Logger";
import {haversine} from "./vectors";
import Victor from "victor";
import {PathFindingLineTrace, PathFinding_ClosestStationInPath, PathFinding_FindPathAndHaversineSum} from "../../pathfinding/api";
import _uniq from "lodash/fp/uniq";
import {postConfig, postToInternalIds, StationConfig} from "../../config/stations";
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

export const getClosestStation = (train: ExtendedTrain, stationsInPath: string[]) => {
    const allStationsAndDistance = stationsInPath
        .map((sn: string) => postToInternalIds[encodeURIComponent(sn)]?.id ? postConfig[postToInternalIds[encodeURIComponent(sn)].id] : undefined)
        .filter((sConfig): sConfig is Exclude<typeof sConfig, undefined> => sConfig !== undefined)
        .map((s) => {
            const truePos = s.platformPosOverride;
            return {
                ...s,
                distanceToStation: haversine(truePos as [number, number], [train.TrainData.Longitute, train.TrainData.Latititute]),
                stationInternalId: s.id
            }
        })
    return _minBy<ExtendedStationConfig>(
        'distanceToStation',
        allStationsAndDistance
    )
}

const getDirectionVector = (positionsArray: [number, number][]): Victor | undefined => {
    if (positionsArray.length < 2) return undefined;
    const [pointA, pointB] = positionsArray.slice(-2);
    return Victor.fromArray(pointA).subtract(Victor.fromArray(pointB)).normalize();
}

export const getTrainDetails = (previousTrains: React.MutableRefObject<{[k: string]: DetailedTrain;} | null>, post: string, trainTimetables: Dictionary<TrainTimeTableRow[]>, dateNow: Date) =>(t: ExtendedTrain) => {
    const previousTrainData = previousTrains.current?.[t.TrainNoLocal as string];
    const inTimetableStations = trainTimetables[t.TrainNoLocal]?.map((ttRow) => ttRow.nameForPerson) ?? Object.values(postConfig).map((p) => p.srName)
    const closestStation = getClosestStation(t, inTimetableStations);
    // TODO: Handle closestStation might be undefined
    const [pfLineTrace] = PathFinding_FindPathAndHaversineSum((closestStation as ExtendedStationConfig).id, postConfig[post].id, post);
    const previousDirectionVector = t?.TrainNoLocal && previousTrains.current ? previousTrainData?.directionVector : undefined;
    const previousPositions = t?.TrainNoLocal && previousTrains.current ? previousTrainData?.positionsArray : undefined;
    const trainPosVector: [number, number] = [t.TrainData.Longitute, t.TrainData.Latititute];
    const positionsArray = _uniq<[number, number]>([...(previousPositions ?? []), trainPosVector]);
    const directionVector = getDirectionVector(positionsArray);
    const pfClosestStation = directionVector && PathFinding_ClosestStationInPath(pfLineTrace, trainPosVector);
    let lastDelay = previousTrainData?.lastDelay;
    if (previousTrainData?.TrainData && previousTrainData?.TrainData.VDDelayedTimetableIndex < t.TrainData.VDDelayedTimetableIndex) {
        const stationPassed = trainTimetables[t.TrainNoLocal]?.find(ttRow => ttRow.indexOfPoint === t.TrainData.VDDelayedTimetableIndex);
        if (stationPassed && dateNow) {
            lastDelay = differenceInMinutes(new Date(stationPassed.scheduledDepartureObject.getFullYear(), stationPassed.scheduledDepartureObject.getMonth(), stationPassed.scheduledDepartureObject.getDate(), dateNow.getHours(), dateNow.getMinutes()), stationPassed.scheduledDepartureObject);
        }
    }

    console_log("For train " + t?.TrainNoLocal, pfLineTrace);

    return {...t,
        // TODO: Avoid O(n)
        pfLineTrace: pfLineTrace,
        closestStation: pfClosestStation?.srName ?? closestStation?.srName,
        closestStationId: closestStation?.id,
        positionsArray: positionsArray.length > 5 ? positionsArray.slice(2) : positionsArray,
        directionVector: directionVector && directionVector.x === 0 && directionVector.y === 0 ? previousDirectionVector ?? [0,0] : directionVector,
        timetable: trainTimetables[t.TrainNoLocal],
        lastDelay,
    } as DetailedTrain
}

type TrainDetails = {
    pfLineTrace: PathFindingLineTrace,
    closestStation: string,
    closestStationId: string,
    positionsArray: [number, number][],
    directionVector: Victor,
    timetable: TrainTimeTableRow[],
    lastDelay?: number,
}

export type DetailedTrain = ExtendedTrain & TrainDetails;
