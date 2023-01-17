import React from "react";
import {getStations, getTimetable, getTrains} from "../api/api";
import {Alert} from "flowbite-react";
import {EDRTable} from "./Table";
import _keyBy from "lodash/fp/keyBy";
import _map from "lodash/fp/map";
import {postConfig, serverTzMap} from "../config";
import {useTranslation} from "react-i18next";
import {console_log} from "../utils/Logger";

import {LoadingScreen} from "./components/LoadingScreen";
import {getTrainDetails} from "./functions/trainDetails";

type Props = {
    serverCode: string;
    post: string;
}
/**
 * This compnent is responsible to get and batch all the data before it goes downstream to the table
 */
export const EDR: React.FC<Props> = ({serverCode, post}) => {
    const currentStation = postConfig[post];
    const [loading, setLoading] = React.useState(true);
    const [stations, setStations] = React.useState<any | undefined>();
    const [trains, setTrains] = React.useState<any | undefined>();
    const [timetable, setTimetable] = React.useState<any | undefined>();
    const [trainsWithDetails, setTrainsWithDetails] = React.useState<any | undefined>();
    const {t} = useTranslation();
    const previousTrains = React.useRef<{[k: string]: any} | null>(null);
    const serverTz = serverTzMap[serverCode.toUpperCase()] ?? 'Europe/Paris';

    // Gets raw simrail data
    const fetchAllDatas = () => {
        getTimetable(serverCode,  post).then((data) => {
            setTimetable(data);
            getStations(serverCode).then((data) => {
                setStations(_keyBy('Name', data));
                getTrains(serverCode).then((data) => {
                    setTrains(data);
                    setLoading(false);
                });
            }).catch(() => setTimeout(fetchAllDatas, 5000));
        }).catch(() => setTimeout(fetchAllDatas, 5000));
    }

    // Launches the get from simrail
    React.useEffect(() => {
        setLoading(true);
        console_log("Current station : ", currentStation);
        if(!serverCode || !currentStation) return;
        fetchAllDatas();
        // eslint-disable-next-line
    }, [serverCode, post]);

    // Keeps previous data in memory for comparing changes
    React.useEffect(() => {
        previousTrains.current = trainsWithDetails;
    }, [trainsWithDetails]);

    // Refreshes the train positions every 10 seconds
    React.useEffect(() => {
        window.trainsRefreshWebWorkerId = window.setInterval(() => {
            getTrains(serverCode).then(setTrains);
        }, 10000);
        if (!window.trainsRefreshWebWorkerId) {
            alert(t("app.fatal_error"));
            return;
        }
        return () => window.clearInterval(window.trainsRefreshWebWorkerId);
        // eslint-disable-next-line
    }, [serverCode]);

    // Adds all the calculated infos for online trains. Such as distance or closest station for example
    React.useEffect(() => {
        if (loading || trains.length === 0 || !previousTrains) return;
        const keyedStations = _keyBy('Name', stations);
        const addDetailsToTrains = getTrainDetails(previousTrains, post, currentStation, keyedStations);
        const onlineTrainsWithDetails = _map(addDetailsToTrains, trains);

        setTrainsWithDetails(_keyBy('TrainNoLocal', onlineTrainsWithDetails));

        // eslint-disable-next-line
    }, [stations, trains, previousTrains.current, timetable]);

    if (!loading && trains && trains.length === 0) {
        return <Alert className="mt-8" color="error">{t("app.no_trains")}</Alert>
    }

    if (!loading && !timetable) {
        return <Alert color="failure">{t("app.no_timetable")}</Alert>
    }

    if (!loading && !currentStation)
        return <Alert color="failure">{t("app.station_not_found")}</Alert>

    if (loading)
        return <LoadingScreen timetable={timetable} trains={trains} stations={stations} />

    return <EDRTable timetable={timetable} serverTz={serverTz} trainsWithDetails={trainsWithDetails}/>;
}

