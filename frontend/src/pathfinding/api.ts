import {Node, pathFind_stackMap} from "./data";
import {Vector_DotProduct, vectors} from "../EDR/vectors";
import _reduce from "lodash/reduce";
import {postConfig, postToInternalIds} from "../config";
import Victor from "victor";
import _ from "lodash";
import {console_log} from "../utils/Logger";


const RUN_DATA_HEALTHCHECKS = true;

const resolveSubNode = (nodeId: string | undefined) => {
    if (!nodeId) return undefined;
    return pathFind_stackMap[nodeId];

}

export type PathFindingLineTrace = (Node | undefined)[] | undefined;

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
    subTree: Node | undefined,
    finish: string,
    acc: (Node | undefined)[]
):PathFindingLineTrace  => {
    if (!subTree) return undefined;
    const allAccids = acc.map((n) => n?.id);
    // This avoids circular recursion but is O(n) :'(
    if (allAccids.includes(subTree.id)) return undefined;
    const nxtAcc = [...acc, subTree];
    if (subTree.id === finish) return nxtAcc;
    const leftPath = treeTraversal(resolveSubNode(subTree.left), finish, nxtAcc);
    const rightPath = treeTraversal(resolveSubNode(subTree.right), finish, nxtAcc);
    const branchPath = treeTraversal(resolveSubNode(subTree.branchA), finish, nxtAcc);
    return leftPath ?? rightPath ?? branchPath;
}

export const findPath = (start: Node, finish: string): PathFindingLineTrace => {
    return treeTraversal(start, finish, []);
}

export const dbgTree = (start: Node, finish: string) => {
    console_log("From " + start.id + " To : " + finish);
    const pathFound = findPath(start, finish);
    console_log(pathFound?.map?.((n?: Node) => n?.id).join(" -> "));
    console.assert(pathFound !== undefined && pathFound.filter((p) => p === undefined).length === 0);
}


export const PathFinding_FindPathAndHaversineSum = (start: string, finish: string): [PathFindingLineTrace, number] => {
    const lineTrace = findPath(pathFind_stackMap[start], finish);
    if (!lineTrace) {
        console.error("Pathfinding error ! ", {start, finish});
        return [lineTrace, 0];
    }
    const filteredAllPosPoints: ([number, number])[] =  lineTrace?.map?.((node) =>  node?.platformPosOverride)
        ?.filter((v) => v && !!v[0] && !!v[1]) as [number, number][];

    return [lineTrace, filteredAllPosPoints.reduce((acc, coords, index, array) => {
        return acc + (array[index - 1] ? vectors(array[index - 1], coords) : 0);
    }, 0)];
}

export const PathFinding_ClosestStationInPath = (pfLineTrace: PathFindingLineTrace, directionVector: [number, number], trainPosVector: [number, number]): any => {
    if (!pfLineTrace) return undefined;
    const indexOfClosestStationInPathInTrainDirection = pfLineTrace
        //.map((point) => point?.platformPosOverride ? {...point, dot: Vector_DotProduct(point.platformPosOverride, Victor.fromArray(directionVector))} : undefined)
        //.filter((dotCalc) => dotCalc && dotCalc.dot && dotCalc.dot > 0 && dotCalc.platformPosOverride)
        .filter((dotCalc) => dotCalc && dotCalc.platformPosOverride)
        .map((point) => ({...point, distance: vectors(point!.platformPosOverride!, trainPosVector)}))
        .sort((a, b) => a.distance < b.distance? -1 : 1)

    console_log("Dot resukts : ", indexOfClosestStationInPathInTrainDirection);

    return indexOfClosestStationInPathInTrainDirection[0];
}

/**
 * If the "to" station is found in path, it means the train is going away
 */
export const PathFinding_HasTrainPassedStation = (pfLineTrace: PathFindingLineTrace, playerPost: string, formStation: string, toStation: string, closestStationId: string) => {
    if (!pfLineTrace) {
        console.error("[Pathfinding] No PF station found");
        return false;
    }

    const foundPost = postToInternalIds[encodeURIComponent(formStation)]?.id;
    const foundToPost = postToInternalIds[encodeURIComponent(toStation)]?.id;
    const ltIndex = pfLineTrace.findIndex((e) => e?.id && e?.id === foundPost);
    console_log("From index : ", {ltIndex, formStation, pfLineTrace});

    const [intermediateLineTraceBetweenPostAndDestination] = PathFinding_FindPathAndHaversineSum(foundPost, playerPost)
    const [intermediateLineTrace] = PathFinding_FindPathAndHaversineSum(foundToPost, closestStationId)

    const intersect = _.intersection(intermediateLineTrace, intermediateLineTraceBetweenPostAndDestination);
    console_log("Closest station id : ", closestStationId);
    console_log("Intersect : ", intersect);

    return ltIndex === -1 // From post not found
        && pfLineTrace[0]?.id !== playerPost // Train is not going into station
        && intersect.length === 0; // Train is not in between from dispatch post and small stations in between
}

if (RUN_DATA_HEALTHCHECKS) {

    console_log("[Pathfinding] Healthchecks starting");
    console_log("Stack map : ", pathFind_stackMap);

        dbgTree(pathFind_stackMap.KO, "WP");
    // dbgTree(pathFind_stackMap.KO, "SG_PO");
    // dbgTree(pathFind_stackMap.SG_PO, "KO");
    // dbgTree(pathFind_stackMap.SG_DK, "KO");
    // dbgTree(pathFind_stackMap.OP_PO, "KO");


    const healthChecksKeys = Object.keys(pathFind_stackMap).filter((sm) => !postConfig[sm])
    const healthChecksValues = Object.values(pathFind_stackMap).filter((sm) => !sm.id);
    console.assert(healthChecksKeys.length === 0);
    console.assert(healthChecksValues.length === 0);
    Object.values(pathFind_stackMap).forEach((tgt) => {
        dbgTree(pathFind_stackMap.KO, tgt.id);
        dbgTree(pathFind_stackMap.OP_PO, tgt.id);
    });

    console_log("[Pathfinding] Healthchecks finished");
}
