import React from "react";
import {getStations, getTimetable, getTrains} from "../api/api";
import {Alert} from "flowbite-react";
import {EDRTable} from "./components/Table";
import _keyBy from "lodash/fp/keyBy";
import _map from "lodash/fp/map";
import {serverTzMap} from "../config";
import {useTranslation} from "react-i18next";
import {console_log} from "../utils/Logger";

import {LoadingScreen} from "./components/LoadingScreen";
import {DetailedTrain, getTrainDetails} from "./functions/trainDetails";
import {postConfig} from "../config/stations";
import { TimeTableServiceType } from "../config/trains";
import { Station, Train } from "@simrail/types";
import { Dictionary } from "lodash";
import {redirect, useParams} from "react-router-dom";
import { useSnackbar } from "notistack";
import {StringParam, useQueryParam} from "use-query-params";
import {Graph} from "./components/Graph";

export type TimeTableRow = {
    k: string;
    scheduled_arrival: string;
    real_arrival: string,
    type: TimeTableServiceType,
    train_number: string,
    from: string,
    to: string,
    line: string,
    layover: string,
    stop_type: string,
    platform: string,
    scheduled_departure: string,
    real_departure: string,
    start_station: string,
    terminus_station: string,
    carrier: string,
    type_speed: number,
    hourSort: number,
    secondaryPostsRows: TimeTableRow[]
};


type Props = {
    playSoundNotification: (cb: () => void) => void
}
/**
 * This component is responsible to get and batch all the data before it goes downstream to the table
 */
export const EDR: React.FC<Props> = ({playSoundNotification}) => {
    const {serverCode, post} = useParams<{
        serverCode: string,
        post: string
    }>();

    const [loading, setLoading] = React.useState(true);
    const [stations, setStations] = React.useState<Dictionary<Station> | undefined>();
    const [trains, setTrains] = React.useState<Train[] | undefined>();
    const [timetable, setTimetable] = React.useState<TimeTableRow[] | undefined>();
    const [trainsWithDetails, setTrainsWithDetails] = React.useState<{ [k: string]: DetailedTrain } | undefined>();
    const [isGraphModalOpen, setGraphModalOpen] = React.useState<boolean>(false);
    const {t} = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const previousTrains = React.useRef<{ [k: string]: DetailedTrain } | null>(null);
    const graphFullScreenMode = !!useQueryParam("graphFullScreenMode", StringParam)[0];


    // Gets raw simrail data
    const fetchAllDatas = () => {
        if (!serverCode || !post) return;
        getTimetable(post).then((data: TimeTableRow[]) => {
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

    const currentStation = post ? postConfig[post] : undefined;
    const serverTz = serverCode ? serverTzMap[serverCode?.toUpperCase()] : 'Europe/Paris';

    // Launches the get from simrail
    React.useEffect(() => {
        setLoading(true);
        console_log("Current station : ", currentStation);
        if (!serverCode || !currentStation) return;
        fetchAllDatas();
        // eslint-disable-next-line
    }, [serverCode, post]);

    // Keeps previous data in memory for comparing changes
    React.useEffect(() => {
        previousTrains.current = trainsWithDetails as { [k: string]: DetailedTrain };
    }, [trainsWithDetails]);

    // Refreshes the train positions every 10 seconds
    React.useEffect(() => {
        window.trainsRefreshWebWorkerId = window.setInterval(() => {
            if (!serverCode) return;
            getTrains(serverCode).then(setTrains);
        }, 10000);
        if (!window.trainsRefreshWebWorkerId) {
            enqueueSnackbar(t('APP_fatal_error'), { preventDuplicate: true, variant: 'error', autoHideDuration: 10000 });
            return;
        }
        return () => window.clearInterval(window.trainsRefreshWebWorkerId);
        // eslint-disable-next-line
    }, [serverCode]);

    // Adds all the calculated infos for online trains. Such as distance or closest station for example
    React.useEffect(() => {
        if (loading || (trains as Train[]).length === 0 || !previousTrains || !post || !currentStation) return;
        const keyedStations = _keyBy('Name', stations);
        const addDetailsToTrains = getTrainDetails(previousTrains, post, currentStation, keyedStations);
        const onlineTrainsWithDetails = _map(addDetailsToTrains, trains);

        setTrainsWithDetails(_keyBy('TrainNoLocal', onlineTrainsWithDetails));

        // eslint-disable-next-line
    }, [stations, trains, previousTrains.current, timetable]);

    if (!serverCode || !post)
        redirect("/");

    if (!loading && trains && trains.length === 0) {
        return <Alert className="mt-8" color="error">{t("APP_no_trains")}</Alert>
    }

    if (!loading && !timetable) {
        return <Alert color="failure">{t("APP_no_timetable")}</Alert>
    }

    if (!loading && !currentStation)
        return <Alert color="failure">{t("APP_station_not_found")}</Alert>

    if (loading)
        return <LoadingScreen timetable={timetable as TimeTableRow[]} trains={trains}
                              stations={stations as Dictionary<Station>}/>

    return <>
        {timetable && post && timetable.length && (isGraphModalOpen || graphFullScreenMode)
            ? <Graph
                fullScreenMode={graphFullScreenMode}
                isOpen={isGraphModalOpen}
                timetable={timetable}
                post={post} onClose={() =>
                setGraphModalOpen(false)}
                serverTz={serverTz}
            />
            : null
        }
        {!graphFullScreenMode && <EDRTable playSoundNotification={playSoundNotification}
                     timetable={timetable!}
                     serverTz={serverTz}
                     trainsWithDetails={trainsWithDetails as { [k: string]: DetailedTrain }}
                     post={post!}
                     serverCode={serverCode!}
                    setGraphModalOpen={setGraphModalOpen}
                />
        }
            </>;
}

export default EDR;