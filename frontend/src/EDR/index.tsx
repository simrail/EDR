import React, {useCallback} from "react";
import {getStations, getTimetable, getTrains} from "../api/getTimetable";
import {Progress, Spinner} from "flowbite-react";
import {EDRTable} from "./Table";
import _ from "lodash/fp";
import {haversineDistance} from "./haversineDistance";
import {postConfig, postToInternalIds} from "./config";
import {useTranslation} from "react-i18next";

export const EDR: React.FC<any> = ({serverCode, post}) => {
    const currentStation = postConfig[post]?.srId;//"Katowice_Zawodzie"; /*"Sosnowiec_Główny"*/
    const [stations, setStations] = React.useState<any | undefined>();
    const [trains, setTrains] = React.useState<any | undefined>();
    const [timetable, setTimetable] = React.useState<any | undefined>();
    const [trainsWithHaversine, setTrainsWithHaversine] = React.useState<any | undefined>();
    const {t} = useTranslation();

    const previousTrains = React.useRef<{[k: string]: any} | null>(null);

    const loading = !timetable || !stations || !trains;

    React.useEffect(() => {
        if(!serverCode || !currentStation) return;
        getTimetable(serverCode,  currentStation).then((data) => {
            setTimetable(data);
            getStations(serverCode).then((data) => {
                setStations(data);
                getTrains(serverCode).then((data) => {
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
                'distanceToStation', stations
                .map((s: any) => {
                    const truePos = getOverridenStationPos(s.Name);
                    return {
                        ...s,
                        distanceToStation: haversineDistance(truePos, [train.TrainData.Longitute, train.TrainData.Latititute])
                    }
                })
            )?.Name

        const withHaversineTrains = _.map((t: any) => {
            const previousDistances = t?.TrainNoLocal && previousTrains.current ? previousTrains.current?.[t.TrainNoLocal as string]?.distanceToStation : undefined;
            const currentDistance = haversineDistance(getOverridenStationPos(currentStation.replace("_", " ")), [t.TrainData.Longitute, t.TrainData.Latititute]);
            // console.log(currentDistance, previousDistances?.[-1]);
            // TODO: Calculate nearest station
            return {...t,
                // TODO: Avoid O(n)
                distanceToStation: _.uniq([...(previousDistances ?? []), currentDistance]),
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

    if (!currentStation)
        return <>Fatal error: Current station not found. (J'ai changé les ids internes, essaye de revenir au menu)</>

    if (loading)
        return <div className="min-h-screen flex flex-col justify-center items-center text-center">
            <div>{t('edr.loading.main_message')}</div>
            <div>{t("edr.loading.schedules")}:  {!timetable ? <Spinner size="xs" /> : <>✓</> }</div>
            <div>{t("edr.loading.stations")}:  {!stations ? <Spinner size="xs" /> : <>✓</> }</div>
            <div>{t("edr.loading.trains")}:  {!trains ? <Spinner size="xs" /> : <>✓</> }</div>
        </div>

    return <EDRTable timetable={timetable} trainsWithHaversine={trainsWithHaversine}/>;
}

