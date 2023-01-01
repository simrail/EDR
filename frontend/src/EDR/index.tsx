import React, {useCallback} from "react";
import {getStations, getTimetable, getTrains} from "../api/getTimetable";
import {Progress, Spinner} from "flowbite-react";
import {EDRTable} from "./Table";
import _ from "lodash/fp";
import {haversineDistance} from "./haversineDistance";

export const EDR: React.FC<any> = ({serverCode, post}) => {
    const currentStation = post;//"Katowice_Zawodzie"; /*"Sosnowiec_Główny"*/
    const [stations, setStations] = React.useState<any | undefined>();
    const [trains, setTrains] = React.useState<any | undefined>();
    const [timetable, setTimetable] = React.useState<any | undefined>();
    const [trainsWithHaversine, setTrainsWithHaversine] = React.useState<any | undefined>();
    const [isBatching, setBatching] = React.useState<boolean>(true);

    const previousTrains = React.useRef<{[k: string]: any} | null>(null);

    const loading = !timetable || !stations || !trains;

    React.useEffect(() => {
        if(!serverCode || !post) return;
        getTimetable(serverCode,  post).then((data) => {
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

        const userStation = keyedStations[currentStation.replace("_", " ")];

        // console.log("With user station: ", userStation);

        const withHaversineTrains = _.map((t: any) => {
            const previousDistances = t?.TrainNoLocal && previousTrains.current ? previousTrains.current?.[t.TrainNoLocal as string]?.distanceToStation : undefined;
            const currentDistance = haversineDistance([userStation.Longitude, userStation.Latititude], [t.TrainData.Longitute, t.TrainData.Latititute]);
            // console.log(currentDistance, previousDistances?.[-1]);
            return {...t,
                // TODO: Avoid O(n)
                distanceToStation: _.uniq([...(previousDistances ?? []), currentDistance])
            }
        }, trains);

        // console.log("Previous trains : ", previousTrains);
        // console.log("With haversine trains : ", withHaversineTrains)

        setTrainsWithHaversine(_.keyBy('TrainNoLocal', withHaversineTrains));

    }, [stations, trains, previousTrains.current, timetable]);


    React.useEffect(() => {
    }, []);
    //
    // console.log("Timetable data : ", timetable);
    // console.log("Stations data: ", stations);

    // console.log("Previous trains", previousTrains);

    if (loading)
        return <div className="min-h-screen flex flex-col justify-center items-center text-center">
            <div>Chargement des données de l'EDR</div>
            <div>Horaires:  {!timetable ? <Spinner size="xs" /> : <>✓</> }</div>
            <div>Stations:  {!stations ? <Spinner size="xs" /> : <>✓</> }</div>
            <div>Trains:  {!trains ? <Spinner size="xs" /> : <>✓</> }</div>
        </div>

    return <EDRTable timetable={timetable} trainsWithHaversine={trainsWithHaversine}/>;
}

