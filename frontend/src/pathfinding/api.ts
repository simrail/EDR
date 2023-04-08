import {pathFind_stackMap} from "./data";
import {haversine} from "../EDR/functions/vectors";
import _uniq from "lodash/uniq";
import _minBy from "lodash/minBy";
import {console_log} from "../utils/Logger";
import {postConfig} from "../config/stations";
import { ExtendedStationConfig } from "../EDR/functions/trainDetails";


const RUN_DATA_HEALTHCHECKS = false;

const resolveSubNode = (nodeId: string | undefined) => {
    if (!nodeId) return undefined;
    return pathFind_stackMap[nodeId];

}

export type PathFindingLineTrace = (ExtendedStationConfig | undefined)[] | undefined;

/**
 * N-ary traversal algorithm.
 * This will progressively build all possible routes until the final destination is found.
 * When found, this will return all the posts in between point A and B
 *
 * Not found will return undefined
 *
 * Partial errors will return an undefined element inside the array
 *
 * Too much datapoints will crash JavaScript VM
 */
export const treeTraversal = (
    subTree: ExtendedStationConfig | undefined,
    finish: string,
    acc: (ExtendedStationConfig | undefined)[],
    via?: string
):PathFindingLineTrace  => {
    if (!subTree) return undefined;
    const allAccids = acc.map((n) => n?.id);
    // This avoids circular recursion but is O(n) :'(
    if (allAccids.includes(subTree.id)) return undefined;
    const nxtAcc = [...acc, subTree];
    if (subTree.id === finish) return nxtAcc;
    const leftPath = treeTraversal(resolveSubNode(subTree.left), finish, nxtAcc);
    const rightPath = treeTraversal(resolveSubNode(subTree.right), finish, nxtAcc);
    const branchPathA = treeTraversal(resolveSubNode(subTree.branchA), finish, nxtAcc);
    const branchPathB = treeTraversal(resolveSubNode(subTree.branchB), finish, nxtAcc);
    // TODO: pathfinding lacks weight, wich is alright for now. (Rather good enough)
    // TODO: But it needs to take distance in count instead of number of stations
    // Else pendolino would take interesting routes lmao
    const foundViaPath = [leftPath, rightPath, branchPathA, branchPathB].filter((p) => p?.find((e) => via && e?.id === via))
    return foundViaPath?.[0] ?? _minBy([leftPath, rightPath, branchPathA, branchPathB], 'length');
}

export const findPath = (start: ExtendedStationConfig, finish: string): PathFindingLineTrace => {
    return treeTraversal(start, finish, []);
}

export const dbgTree = (start: string, finish: string, playerPost?: string) => {
    console.log("From " + start + " To : " + finish);
    const [pathFound, distance] = PathFinding_FindPathAndHaversineSum(start, finish, playerPost);
    console.log(pathFound?.map?.((n?: ExtendedStationConfig) => n?.id).join(" -> "));
    console.assert(pathFound !== undefined && pathFound.filter((p) => p === undefined).length === 0);
    console.log("Distance : " + Math.round(distance) + "km" )
}


export const PathFinding_FindPathAndHaversineSum = (start: string, finish: string, playerPost?: string | undefined): [PathFindingLineTrace, number] => {
    const pathA = findPath(pathFind_stackMap[start], playerPost ?? finish);
    const pathB = playerPost ? findPath(pathFind_stackMap[playerPost], finish) : [];
    if (!pathA || !pathB) {
        console.error("Pathfinding error ! ", {start, finish});
        return [undefined, 0];
    }
    const lineTrace = _uniq([...pathA, ...pathB])
    const filteredAllPosPoints: ([number, number])[] =  lineTrace?.map?.((node) =>  node?.platformPosOverride)
        ?.filter((v) => v && !!v[0] && !!v[1]) as [number, number][];

    return [lineTrace, filteredAllPosPoints.reduce((acc, coords, index, array) => {
        return acc + (array[index - 1] ? haversine(array[index - 1], coords) : 0);
    }, 0)];
}

export const PathFinding_ClosestStationInPath = (pfLineTrace: PathFindingLineTrace, trainPosVector: [number, number]): ExtendedStationConfig | undefined => {
    if (!pfLineTrace) return undefined;
    const indexOfClosestStationInPathInTrainDirection = pfLineTrace
        //.map((point) => point?.platformPosOverride ? {...point, dot: Vector_DotProduct(point.platformPosOverride, Victor.fromArray(directionVector))} : undefined)
        //.filter((dotCalc) => dotCalc && dotCalc.dot && dotCalc.dot > 0 && dotCalc.platformPosOverride)
        .filter((dotCalc) => dotCalc && dotCalc.platformPosOverride)
        .map((point) => ({...(point as ExtendedStationConfig), distance: haversine(point!.platformPosOverride!, trainPosVector)}))
        .sort((a, b) => a.distance < b.distance? -1 : 1)

    console_log("Dot resukts : ", indexOfClosestStationInPathInTrainDirection);

    return indexOfClosestStationInPathInTrainDirection[0];
}

if (RUN_DATA_HEALTHCHECKS) {

    console.log("[Pathfinding] Healthchecks starting");
    console.log("Stack map : ", pathFind_stackMap);

        //dbgTree(pathFind_stackMap.KO, "WP");
    // dbgTree(pathFind_stackMap.KO, "SG_PO");
    // dbgTree(pathFind_stackMap.SG_PO, "KO");
    // dbgTree(pathFind_stackMap.SG_DK, "KO");
    // dbgTree(pathFind_stackMap.OP_PO, "KO");


    const healthChecksKeys = Object.keys(pathFind_stackMap).filter((sm) => !postConfig[sm])
    const healthChecksValues = Object.values(pathFind_stackMap).filter((sm) => !sm.id);
    console.assert(healthChecksKeys.length === 0);
    console.assert(healthChecksValues.length === 0);
    /*Object.values(pathFind_stackMap).forEach((tgt) => {
        dbgTree(pathFind_stackMap.KO, tgt.id);
        //dbgTree(pathFind_stackMap.OP_PO, tgt.id);
    });*/

    dbgTree("KO", "WC");
    dbgTree("BK", "LZ_LB");

    dbgTree("BK", "DG_SI");
    dbgTree("KO", "T1_BZ");
    dbgTree("KO", "LZ_LB");
    dbgTree("KO", "IDZ");
    dbgTree("KOZ", "WC");
    dbgTree("TN", "STZ");
    dbgTree("STZ", "TN");
    dbgTree("TN", "STZ");
    dbgTree("KZ","SG_PO")
    console_log("[Pathfinding] Healthchecks finished");
}
