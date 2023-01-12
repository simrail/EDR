import React, {useCallback} from "react";
import {getStations, api, getTrains} from "../api/api";
import {Alert, Progress, Spinner} from "flowbite-react";
import {EDRTable} from "./Table";
import _keyBy from "lodash/fp/keyBy";
import _minBy from "lodash/fp/minBy";
import _uniq from "lodash/fp/uniq";
import _map from "lodash/fp/map";
import {Vector_DotProduct, vectors} from "./vectors";
import {internalConfigPostIds, postConfig, postToInternalIds, serverTzMap} from "../config";
import {useTranslation} from "react-i18next";
import {StringParam, useQueryParam} from "use-query-params";
import {console_log} from "../utils/Logger";
import {PathFinding_ClosestStationInPath, PathFinding_FindPathAndHaversineSum} from "../pathfinding/api";
import Victor from "victor";

export const EDR: React.FC<any> = ({serverCode, post}) => {
    const currentStation = postConfig[post];//"Katowice_Zawodzie"; /*"Sosnowiec_Główny"*/
    const [loading, setLoading] = React.useState(true);
    const [stations, setStations] = React.useState<any | undefined>();
    const [trains, setTrains] = React.useState<any | undefined>();
    const [timetable, setTimetable] = React.useState<any | undefined>();
    const [trainsWithHaversine, setTrainsWithHaversine] = React.useState<any | undefined>();
    const {t} = useTranslation();
    const [cdnBypass] = useQueryParam('cdnBypass', StringParam);
    const previousTrains = React.useRef<{[k: string]: any} | null>(null);

    const serverTz = serverTzMap[serverCode.toUpperCase()] ?? 'Europe/Paris';

    // const loading = !timetable || !stations || !trains;

    React.useEffect(() => {
        setLoading(true);
        console_log("Current station : ", currentStation);
        if(!serverCode || !currentStation) return;
        api(serverCode,  post, !!cdnBypass).then((data) => {
            setTimetable(data);
            getStations(serverCode, !!cdnBypass).then((data) => {
                setStations(_keyBy('Name', data));
                getTrains(serverCode, !!cdnBypass).then((data) => {
                    setTrains(data);
                    setLoading(false);
                });
            });
        });
    }, [serverCode, post]);

    React.useEffect(() => {
        previousTrains.current = trainsWithHaversine;
    }, [trainsWithHaversine]);

    React.useEffect(() => {
        window.trainsRefreshWebWorkerId = window.setInterval(() => {
            getTrains(serverCode).then(setTrains);
        }, 10000);
        if (!window.trainsRefreshWebWorkerId) {
            alert(t("app.fatal_error"));
            return;
        }
        return () => window.clearInterval(window.trainsRefreshWebWorkerId);
    }, [serverCode]);

    // TODO: Effect needs refactoring it is HUGE
    React.useEffect(() => {
        if (loading || trains.length === 0 || !previousTrains) return;
        // console_log("With trains data : ", trains);
        const keyedStations = _keyBy('Name', stations);
        // const keyedTrains = _.keyBy('TrainNoLocal', trains);
        // console_log("With stations data : ", keyedStations);
        // console_log("With trains data : ", keyedTrains);

        const getOverridenStationPos = (postId: string) =>
            postConfig[postId]?.platformPosOverride
                ?? [keyedStations[internalConfigPostIds[encodeURIComponent(postId)]].Longitude, keyedStations[postId].Latititude]



        // console_log("With user station: ", userStation);
        // TODO: Change to closest station in path (and if possible, forward of the train)
        // TODO: In between data points, train tends to "move away" but is not really moving away.
        // TODO: With two data points and current station it should be possible to infer next path station
        const getClosestStation = (train: any) =>
            _minBy<any>(
                'distanceToStation', Object.values(postConfig)
                .map((s: any) => {
                    console_log("s", s)
                    console_log("stations ", stations);
                    const truePos = s.platformPosOverride;
                    console_log("True pos : ", truePos);
                    return {
                        ...s,
                        distanceToStation: vectors(truePos, [train.TrainData.Longitute, train.TrainData.Latititute]),
                        stationInternalId: s.id
                    }
                })
            )

        const getDirectionVector = (positionsArray: [number, number][]): Victor | undefined => {
            if (positionsArray.length < 2) return undefined;
            const [pointA, pointB] = positionsArray.slice(-2);
            return Victor.fromArray(pointA).subtract(Victor.fromArray(pointB)).normalize();
        }


        const withHaversineTrains = _map((t: any) => {
            const closestStation = getClosestStation(t);
            const [pfLineTrace, distanceCompletePath] = PathFinding_FindPathAndHaversineSum(closestStation.id, postConfig[post].id);
            const previousDirectionVector = t?.TrainNoLocal && previousTrains.current ? previousTrains.current?.[t.TrainNoLocal as string]?.directionVector : undefined;
            const previousDistances = t?.TrainNoLocal && previousTrains.current ? previousTrains.current?.[t.TrainNoLocal as string]?.distanceToStation : undefined;
            const previousPositions = t?.TrainNoLocal && previousTrains.current ? previousTrains.current?.[t.TrainNoLocal as string]?.positionsArray : undefined;
            const previousGoingAwayFromStatn = t?.TrainNoLocal && previousTrains.current ? previousTrains.current?.[t.TrainNoLocal as string]?.goingAwayFromStation : undefined;

            // console.log(distanceCompletePath, previousDistances?.[-1]);

            const trainPosVector: [number, number] = [t.TrainData.Longitute, t.TrainData.Latititute];
            const currentRawDistance = vectors(getOverridenStationPos(post), trainPosVector);
            const rawDistancesArray = _uniq([...(previousDistances ?? []), currentRawDistance]);
            const positionsArray = _uniq([...(previousPositions ?? []), trainPosVector]);
            const directionVector = getDirectionVector(positionsArray);
            const pfClosestStation = directionVector && PathFinding_ClosestStationInPath(pfLineTrace, [directionVector.x, directionVector.y], trainPosVector);
            const playerDistanceToNextStation = pfClosestStation && pfClosestStation?.platformPosOverride ? vectors(pfClosestStation.platformPosOverride,  trainPosVector)  : currentRawDistance;
            const distanceArray = _uniq([...(previousDistances ?? []), playerDistanceToNextStation + distanceCompletePath]);
            const dotProductForGoingAway = directionVector && currentStation.platformPosOverride ? Vector_DotProduct(currentStation.platformPosOverride, directionVector) : 0

            console_log("For train " + t?.TrainNoLocal, pfLineTrace);

            // console.log("Distances array : ", distanceArray);
            return {...t,
                // TODO: Avoid O(n)
                distanceToStation: distanceArray.length > 20 ? distanceArray.slice(1) : distanceArray,
                pfLineTrace: pfLineTrace,
                closestStation: pfClosestStation?.srId ?? closestStation?.srId,
                closestStationId: closestStation?.id,
                rawDistances: rawDistancesArray.length > 5 ? rawDistancesArray.slice(1) : distanceArray,
                positionsArray: positionsArray.length > 5 ? positionsArray.slice(2) : positionsArray,
                directionVector: directionVector && directionVector.x === 0 && directionVector.y === 0 ? previousDirectionVector ?? [0,0] : directionVector,
                dotProductForGoingAwai: dotProductForGoingAway,
                goingAwayFromStation: dotProductForGoingAway === 0 ? previousGoingAwayFromStatn ? previousGoingAwayFromStatn  : false : dotProductForGoingAway < 0
            }
        }, trains);

        // console_log("Previous trains : ", previousTrains);
        // console.log("With haversine trains : ", withHaversineTrains)

        setTrainsWithHaversine(_keyBy('TrainNoLocal', withHaversineTrains));

    }, [stations, trains, previousTrains.current, timetable]);

    //
    // console_log("Timetable data : ", timetable);
    // console_log("Stations data: ", stations);

    console_log("Previous trains", previousTrains);

    // console_log("haversine trains : ", trainsWithHaversine);

    console_log("trains:", trains)

    if (!loading && trains && trains.length === 0) {
        return <Alert className="mt-8" color="error">{t("app.no_trains")}</Alert>
    }

    if (!loading && !timetable) {
        return <Alert color="failure">{t("app.no_timetable")}</Alert>
    }

    if (!loading && !currentStation)
        return <Alert color="failure">{t("app.station_not_found")}</Alert>

    if (loading)
        return <div className="min-h-screen flex flex-col justify-center items-center text-center">
            <div>{t('edr.loading.main_message')}</div>
            <div>{t("edr.loading.schedules")}:  {!timetable ? <Spinner size="xs" /> : <>✓</> }</div>
            <div>{t("edr.loading.stations")}:  {!stations ? <Spinner size="xs" /> : <>✓</> }</div>
            <div>{t("edr.loading.trains")}:  {!trains ? <Spinner size="xs" /> : <>✓</> }</div>
        </div>

    return <EDRTable timetable={timetable} serverTz={serverTz} trainsWithHaversine={trainsWithHaversine}/>;
}

