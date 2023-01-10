import React, {useCallback} from "react";
import {getStations, api, getTrains} from "../api/api";
import {Alert, Progress, Spinner} from "flowbite-react";
import {EDRTable} from "./Table";
import _keyBy from "lodash/fp/keyBy";
import _minBy from "lodash/fp/minBy";
import _uniq from "lodash/fp/uniq";
import _map from "lodash/fp/map";
import {haversineDistance} from "./haversineDistance";
import {postConfig, postToInternalIds, serverTzMap} from "../config";
import {useTranslation} from "react-i18next";
import {StringParam, useQueryParam} from "use-query-params";
import {console_log} from "../utils/Logger";

export const EDR: React.FC<any> = ({serverCode, post}) => {
    const currentStation = postConfig[post]?.srId;//"Katowice_Zawodzie"; /*"Sosnowiec_Główny"*/
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
        api(serverCode,  currentStation, !!cdnBypass).then((data) => {
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
        }, 5000);
        if (!window.trainsRefreshWebWorkerId) {
            alert(t("app.fatal_error"));
            return;
        }
        return () => window.clearInterval(window.trainsRefreshWebWorkerId);
    }, [serverCode]);

    React.useEffect(() => {
        if (loading || trains.length === 0 || !previousTrains) return;
        // console_log("With trains data : ", trains);
        const keyedStations = _keyBy('Name', stations);
        // const keyedTrains = _.keyBy('TrainNoLocal', trains);
        // console_log("With stations data : ", keyedStations);
        // console_log("With trains data : ", keyedTrains);

        const getOverridenStationPos = (postId: string) =>
            postConfig[postToInternalIds[encodeURIComponent(postId)]]?.platformPosOverride
                ?? [keyedStations[postId].Longitude, keyedStations[postId].Latititude]



        // console_log("With user station: ", userStation);
        const getClosestStation = (train: any) =>
            _minBy<any>(
                'distanceToStation', Object.values(postConfig)
                .map((s: any) => {
                    console_log("s", s)
                    console_log("stations ", stations);
                    const srStation = stations[s.srId];
                    const truePos = s.platformPosOverride ?? [srStation.Latititute, srStation.Longitute];
                    console_log("True pos : ", truePos);
                    return {
                        ...s,
                        distanceToStation: haversineDistance(truePos, [train.TrainData.Longitute, train.TrainData.Latititute])
                    }
                })
            )?.srId

        const withHaversineTrains = _map((t: any) => {
            const previousDistances = t?.TrainNoLocal && previousTrains.current ? previousTrains.current?.[t.TrainNoLocal as string]?.distanceToStation : undefined;
            const currentDistance = haversineDistance(getOverridenStationPos(currentStation.replace("_", " ")), [t.TrainData.Longitute, t.TrainData.Latititute]);
            // console_log(currentDistance, previousDistances?.[-1]);
            // TODO: Calculate nearest station
            const distanceArray = _uniq([...(previousDistances ?? []), currentDistance]);
            return {...t,
                // TODO: Avoid O(n)
                distanceToStation: distanceArray.length > 5 ? distanceArray.slice(1) : distanceArray,
                closestStation: getClosestStation(t)
            }
        }, trains);

        // console_log("Previous trains : ", previousTrains);
        // console_log("With haversine trains : ", withHaversineTrains)

        setTrainsWithHaversine(_keyBy('TrainNoLocal', withHaversineTrains));

    }, [stations, trains, previousTrains.current, timetable]);

    //
    // console_log("Timetable data : ", timetable);
    // console_log("Stations data: ", stations);

    // console_log("Previous trains", previousTrains);

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

