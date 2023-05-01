import { Train } from "@simrail/types";

export type ExtendedTrain = Train & {
    distanceFromStation: number,
    lineEta: number,
}