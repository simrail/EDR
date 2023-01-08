import React, {useCallback} from "react";
import {getStations, api, getTrains} from "../api/api";
import {Alert, Progress, Spinner} from "flowbite-react";
import {EDRTable} from "./Table";
import _ from "lodash/fp";
import {haversineDistance} from "./haversineDistance";
import {postConfig, postToInternalIds} from "../config";
import {useTranslation} from "react-i18next";
import {StringParam, useQueryParam} from "use-query-params";

export const EDR: React.FC<any> = ({serverCode, post}) => {
    const currentStation = postConfig[post]?.srId;//"Katowice_Zawodzie"; /*"Sosnowiec_Główny"*/
    const [stations, setStations] = React.useState<any | undefined>();
    const [trains, setTrains] = React.useState<any | undefined>();
    const [timetable, setTimetable] = React.useState<any | undefined>();
    const [trainsWithHaversine, setTrainsWithHaversine] = React.useState<any | undefined>();
    const {t} = useTranslation();
    const [cdnBypass] = useQueryParam('cdnBypass', StringParam);


    const previousTrains = React.useRef<{[k: string]: any} | null>(null);

    const loading = !timetable || !stations || !trains;

    React.useEffect(() => {
        if(!serverCode || !currentStation) return;
        api(serverCode,  currentStation, !!cdnBypass).then((data) => {
            setTimetable(data);
            getStations(serverCode, !!cdnBypass).then((data) => {
                setStations(_.keyBy('Name', data));
                getTrains(serverCode, !!cdnBypass).then((data) => {
                    setTrains(data);
                });
            });
        });
    }, [serverCode, post]);

    React.useEffect(() => {
        previousTrains.current = trainsWithHaversine;
    }, [trainsWithHaversine]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            getTrains(serverCode).then(setTrains);
        }, 5000);
        return () => window.clearInterval(interval);
    }, [serverCode]);

    React.useEffect(() => {
        if (loading || trains.length === 0 || !previousTrains) return;
        // console.log("With trains data : ", trains);
        const keyedStations = _.keyBy('Name', stations);
        // const keyedTrains = _.keyBy('TrainNoLocal', trains);
        // console.log("With stations data : ", keyedStations);
        // console.log("With trains data : ", keyedTrains);

        const getOverridenStationPos = (postId: string) =>
            postConfig[postToInternalIds[encodeURIComponent(postId)]]?.platformPosOverride
                ?? [keyedStations[postId].Longitude, keyedStations[postId].Latititude]



        // console.log("With user station: ", userStation);
        const getClosestStation = (train: any) =>
            _.minBy<any>(
                'distanceToStation', Object.values(postConfig)
                .map((s: any) => {
                    console.log("s", s)
                    console.log("stations ", stations);
                    const srStation = stations[s.srId];
                    const truePos = s.platformPosOverride ?? [srStation.Latititute, srStation.Longitute];
                    console.log("True pos : ", truePos);
                    return {
                        ...s,
                        distanceToStation: haversineDistance(truePos, [train.TrainData.Longitute, train.TrainData.Latititute])
                    }
                })
            )?.srId

        const withHaversineTrains = _.map((t: any) => {
            const previousDistances = t?.TrainNoLocal && previousTrains.current ? previousTrains.current?.[t.TrainNoLocal as string]?.distanceToStation : undefined;
            const currentDistance = haversineDistance(getOverridenStationPos(currentStation.replace("_", " ")), [t.TrainData.Longitute, t.TrainData.Latititute]);
            // console.log(currentDistance, previousDistances?.[-1]);
            // TODO: Calculate nearest station
            const distanceArray = _.uniq([...(previousDistances ?? []), currentDistance]);
            return {...t,
                // TODO: Avoid O(n)
                distanceToStation: distanceArray.length > 5 ? distanceArray.slice(1) : distanceArray,
                closestStation: getClosestStation(t)
            }
        }, trains);

        // console.log("Previous trains : ", previousTrains);
        // console.log("With haversine trains : ", withHaversineTrains)

        setTrainsWithHaversine(_.keyBy('TrainNoLocal', withHaversineTrains));

    }, [stations, trains, previousTrains.current, timetable]);

    //
    // console.log("Timetable data : ", timetable);
    // console.log("Stations data: ", stations);

    // console.log("Previous trains", previousTrains);

    // console.log("haversine trains : ", trainsWithHaversine);

    console.log("trains:", trains)
    if (trains && trains.length === 0) {
        return <Alert className="mt-8" color="error">There is no trains! The server is probably rebooting</Alert>
    }

    if (!timetable) {
        return <Alert color="failure">Fatal error: Unable to fetch timetable. Simrail server is probably rebooting</Alert>
    }

    if (!currentStation)
        return <Alert color="failure">Fatal error: Current station not found. (J'ai changé les ids internes, essaye de revenir au menu)</Alert>

    if (loading)
        return <div className="min-h-screen flex flex-col justify-center items-center text-center">
            <div>{t('edr.loading.main_message')}</div>
            <div>{t("edr.loading.schedules")}:  {!timetable ? <Spinner size="xs" /> : <>✓</> }</div>
            <div>{t("edr.loading.stations")}:  {!stations ? <Spinner size="xs" /> : <>✓</> }</div>
            <div>{t("edr.loading.trains")}:  {!trains ? <Spinner size="xs" /> : <>✓</> }</div>
        </div>

    return <EDRTable timetable={timetable} trainsWithHaversine={trainsWithHaversine}/>;
}

