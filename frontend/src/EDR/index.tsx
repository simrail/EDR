import React from "react";
import {getStations, getTimetable, getTrains, getTrainTimetable, getTzOffset} from "../api/api";
import {Alert} from "flowbite-react";
import {EDRTable} from "./components/Table";
import _keyBy from "lodash/fp/keyBy";
import _map from "lodash/fp/map";
import _groupBy from "lodash/fp/groupBy";
import {useTranslation} from "react-i18next";
import {console_log} from "../utils/Logger";
import _difference from "lodash/difference";

import {LoadingScreen} from "./components/LoadingScreen";
import {DetailedTrain, getTrainDetails} from "./functions/trainDetails";
import {postConfig} from "../config/stations";
import { TimeTableServiceType } from "../config/trains";
import { Station, Train } from "@simrail/types";
import { Dictionary } from "lodash";
import {redirect, useParams} from "react-router-dom";
import { useSnackbar } from "notistack";
import {StringParam, useQueryParam} from "use-query-params";
const Graph = React.lazy(() => import("./components/Graph"));

export type TimeTableRow = {
    k: string;
    departure_time: string;
    arrival_time: string,
    train_type: TimeTableServiceType,
    train_number: string,
    from_post: string,
    to_post: string,
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
    isWebpSupported: boolean,
    playSoundNotification: (cb: () => void) => void
}

export type FilterConfig = {
    maxRange?: number;
    maxTime?: number;
    onlyApproaching: boolean;
    onlyOnTrack: boolean;
}

export const presetFilterConfig: {[k: string]: FilterConfig} = {
    default: {
        onlyApproaching: false,
        onlyOnTrack: false
    },
    near: {
        onlyApproaching: false,
        onlyOnTrack: true
    },
    approaching: {
        onlyApproaching: true,
        onlyOnTrack: false
    }
}

/**
 * This component is responsible to get and batch all the data before it goes downstream to the table
 */
export const EDR: React.FC<Props> = ({playSoundNotification, isWebpSupported}) => {
    const {serverCode, post} = useParams<{
        serverCode: string,
        post: string
    }>();

    const [loading, setLoading] = React.useState(true);
    const [stations, setStations] = React.useState<Dictionary<Station> | undefined>();
    const [trains, setTrains] = React.useState<Train[] | undefined>();
    const [trainTimetables, setTrainTimetables] = React.useState<any | undefined>();
    const [timetable, setTimetable] = React.useState<TimeTableRow[] | undefined>();
    const [tzOffset, setTzOffset] = React.useState<number | undefined>();
    const [trainsWithDetails, setTrainsWithDetails] = React.useState<{ [k: string]: DetailedTrain } | undefined>();
    const [isGraphModalOpen, setGraphModalOpen] = React.useState<boolean>(false);
    const [filterConfig, setFilterConfig] = React.useState<FilterConfig>(presetFilterConfig.default)
    const {t} = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const previousTrains = React.useRef<{ [k: string]: DetailedTrain } | null>(null);
    const graphFullScreenMode = !!useQueryParam("graphFullScreenMode", StringParam)[0];


    // Gets raw simrail data
    const fetchAllDatas = () => {
        if (!serverCode || !post) return;
        getTzOffset(serverCode).then((v) => {
            setTzOffset(v);
            getTimetable(post).then((data: TimeTableRow[]) => {
                setTimetable(data);
                getStations(serverCode).then((data) => {
                    setStations(_keyBy('Name', data));
                    getTrains(serverCode).then((data) => {
                        setTrains(data);
                        setLoading(false);
                    }).catch(() => {
                        enqueueSnackbar(t('EDR_train_refresh_failed'), { preventDuplicate: true, variant: 'error', autoHideDuration: 5000 });
                        setTimeout(fetchAllDatas, 5000);
                    });
                }).catch(() => {
                    enqueueSnackbar(t('EDR_station_refresh_failed'), { preventDuplicate: true, variant: 'error', autoHideDuration: 5000 });
                    setTimeout(fetchAllDatas, 5000);
                });
            }).catch(() => {
                enqueueSnackbar(t('EDR_timetable_refresh_failed'), { preventDuplicate: true, variant: 'error', autoHideDuration: 5000 });
                setTimeout(fetchAllDatas, 5000);
            });
        }).catch(() => {
            enqueueSnackbar(t('EDR_timetable_refresh_failed'), { preventDuplicate: true, variant: 'error', autoHideDuration: 5000 });
            setTimeout(fetchAllDatas, 5000);
        });
    }

    const currentStation = post ? postConfig[post] : undefined;

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
        if (loading || (trains as Train[]).length === 0 || !previousTrains || !post || !currentStation || !trainTimetables) return;
        setTimeout(() => {
            const keyedStations = _keyBy('Name', stations);
            const addDetailsToTrains = getTrainDetails(previousTrains, post, currentStation, keyedStations, trainTimetables);
            const onlineTrainsWithDetails = _map(addDetailsToTrains, trains);

            setTrainsWithDetails(_keyBy('TrainNoLocal', onlineTrainsWithDetails));
        }, 1);
        // eslint-disable-next-line
    }, [stations, JSON.stringify(trains), JSON.stringify(previousTrains.current), JSON.stringify(timetable), JSON.stringify(trainTimetables)]);

    React.useEffect(() => {
        // TODO: Add a check to avoid refetching every 10s
        if (!trains) return;
        const allTrainIds = trains.map((t) => t.TrainNoLocal)
        const previousTrainIds = Object.keys(previousTrains?.current ?? []);
        const difference = _difference(allTrainIds, previousTrainIds);
        if (difference.length === 0) return;
        Promise.all(difference.map(getTrainTimetable)).then((timetables) => {
            setTrainTimetables(_groupBy('train_number', [...Object.values(trainTimetables ?? {}), timetables.flat()]))
        });
    }, [trains])

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
        return <LoadingScreen timetable={timetable as TimeTableRow[]}
                              trains={trains}
                              stations={stations as Dictionary<Station>}
                              tzOffset={tzOffset}
        />

    return <>
        {timetable && tzOffset !== undefined && post && timetable.length && (isGraphModalOpen || graphFullScreenMode)
            ? <Graph
                fullScreenMode={graphFullScreenMode}
                isOpen={isGraphModalOpen}
                timetable={timetable}
                post={post} onClose={() =>
                setGraphModalOpen(false)}
                serverTzOffset={tzOffset}
            />
            : null
        }
        {!graphFullScreenMode && tzOffset !== undefined && <EDRTable playSoundNotification={playSoundNotification}
                timetable={timetable!}
                serverTzOffset={tzOffset}
                trainsWithDetails={trainsWithDetails as { [k: string]: DetailedTrain }}
                post={post!}
                serverCode={serverCode!}
                setGraphModalOpen={setGraphModalOpen}
                isWebpSupported={isWebpSupported}
                filterConfig={filterConfig}
                setFilterConfig={setFilterConfig}
            />
        }
            </>;
}

export default EDR;