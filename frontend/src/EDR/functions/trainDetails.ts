import _minBy from "lodash/fp/minBy";
import {internalConfigPostIds} from "../../config";
import {console_log} from "../../utils/Logger";
import {haversine, Vector_DotProduct} from "./vectors";
import Victor from "victor";
import {PathFindingLineTrace, PathFinding_ClosestStationInPath, PathFinding_FindPathAndHaversineSum} from "../../pathfinding/api";
import _uniq from "lodash/fp/uniq";
import {postConfig, postToInternalIds, StationConfig} from "../../config/stations";
import { Station, Train } from "@simrail/types";
import { Dictionary } from "lodash";
import { TrainTimeTableRow } from "../../Sirius";

type ExtraStationConfig = {
    distanceToStation?: number,
    stationInternalId?: string,
    left?: string,
    right?: string,
    branchA?: string
    branchB?: string
}

export type ExtendedStationConfig = StationConfig & ExtraStationConfig;

export const getClosestStation = (train: Train, stationsInPath: string[]) => {
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
const _getOverridenStationPos = (keyedStations: Dictionary<Station>) => (postId: string) =>
    postConfig[postId]?.platformPosOverride
    ?? [keyedStations[internalConfigPostIds[encodeURIComponent(postId)]].Longitude, keyedStations[postId].Latititude]

export const getTrainDetails = (previousTrains: React.MutableRefObject<{[k: string]: DetailedTrain;} | null>, post: string, currentStation: StationConfig, keyedStations: Dictionary<Station>, trainTimetables: Dictionary<TrainTimeTableRow[]>) =>(t: Train) => {
    const getOverridenStationPos = _getOverridenStationPos(keyedStations);
    const inTimetableStations =  trainTimetables[t.TrainNoLocal]?.map((ttRow) => ttRow.nameForPerson) ?? Object.values(postConfig).map((p) => p.srId)
    const closestStation = getClosestStation(t, inTimetableStations);
    // TODO: Handle closestStation might be undefined
    const [pfLineTrace, distanceCompletePath] = PathFinding_FindPathAndHaversineSum((closestStation as ExtendedStationConfig).id, postConfig[post].id, post);
    const previousDirectionVector = t?.TrainNoLocal && previousTrains.current ? previousTrains.current?.[t.TrainNoLocal as string]?.directionVector : undefined;
    const previousDistances = t?.TrainNoLocal && previousTrains.current ? previousTrains.current?.[t.TrainNoLocal as string]?.distanceToStation : undefined;
    const previousPositions = t?.TrainNoLocal && previousTrains.current ? previousTrains.current?.[t.TrainNoLocal as string]?.positionsArray : undefined;
    const previousGoingAwayFromStatn = t?.TrainNoLocal && previousTrains.current ? previousTrains.current?.[t.TrainNoLocal as string]?.goingAwayFromStation : undefined;
    const trainPosVector: [number, number] = [t.TrainData.Longitute, t.TrainData.Latititute];
    const currentRawDistance = haversine(getOverridenStationPos(post), trainPosVector);
    const rawDistancesArray = _uniq<number>([...(previousDistances ?? []), currentRawDistance]);
    const positionsArray = _uniq<[number, number]>([...(previousPositions ?? []), trainPosVector]);
    const directionVector = getDirectionVector(positionsArray);
    const pfClosestStation = directionVector && PathFinding_ClosestStationInPath(pfLineTrace, [directionVector.x, directionVector.y], trainPosVector);
    const playerDistanceToNextStation = pfClosestStation && pfClosestStation?.platformPosOverride ? haversine(pfClosestStation.platformPosOverride,  trainPosVector)  : currentRawDistance;
    const distanceArray = _uniq<number>([...(previousDistances ?? []), playerDistanceToNextStation + distanceCompletePath]);
    const dotProductForGoingAway = directionVector && currentStation.platformPosOverride ? Vector_DotProduct(currentStation.platformPosOverride, directionVector) : 0

    console_log("For train " + t?.TrainNoLocal, pfLineTrace);

    return {...t,
        // TODO: Avoid O(n)
        distanceToStation: distanceArray.length > 20 ? distanceArray.slice(1) : distanceArray,
        pfLineTrace: pfLineTrace,
        closestStation: pfClosestStation?.srId ?? closestStation?.srId,
        closestStationId: closestStation?.id,
        rawDistances: rawDistancesArray.length > 3 ? rawDistancesArray.slice(1) : distanceArray,
        positionsArray: positionsArray.length > 5 ? positionsArray.slice(2) : positionsArray,
        directionVector: directionVector && directionVector.x === 0 && directionVector.y === 0 ? previousDirectionVector ?? [0,0] : directionVector,
        dotProductForGoingAway: dotProductForGoingAway,
        goingAwayFromStation: dotProductForGoingAway === 0 ? previousGoingAwayFromStatn ? previousGoingAwayFromStatn  : false : dotProductForGoingAway < 0,
        timetable: trainTimetables[t.TrainNoLocal]
    } as DetailedTrain
}

type TrainDetails = {
    distanceToStation: number[],
    pfLineTrace: PathFindingLineTrace,
    closestStation: string,
    closestStationId: string,
    rawDistances: number[],
    positionsArray: [number, number][],
    directionVector: Victor,
    dotProductForGoingAway: number,
    goingAwayFromStation: boolean,
    timetable: TrainTimeTableRow[],
}

export type DetailedTrain = Train & TrainDetails;
