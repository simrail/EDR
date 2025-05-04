import React from "react";
import {getPlayer, getServerTime, getStations, getTimetable, getTrainsForPost, getTrainTimetable, getTzOffset} from "../api/api";
import {Alert} from "flowbite-react";
import {EDRTable} from "./components/Table";
import _keyBy from "lodash/fp/keyBy";
import _map from "lodash/fp/map";
import {useTranslation} from "react-i18next";
import {console_log} from "../utils/Logger";
import _difference from "lodash/difference";

import {LoadingScreen} from "./components/LoadingScreen";
import {DetailedTrain, getTrainDetails} from "./functions/trainDetails";
import {postConfig} from "../config/stations";
import { Station } from "@simrail/types";
import { Dictionary, flatMap, groupBy } from "lodash";
import {redirect, useParams} from "react-router-dom";
import { useSnackbar } from "notistack";
import {StringParam, useQueryParam} from "use-query-params";
import { ISteamUser } from "../config/ISteamUser";
import { TrainTimeTableRow } from "../Sirius";
import { TimeTableRow } from "../customTypes/TimeTableRow";
import { ExtendedTrain } from "../customTypes/ExtendedTrain";
import { nowUTC } from "../utils/date";
const Graph = React.lazy(() => import("./components/Graph"));

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
    const [trains, setTrains] = React.useState<ExtendedTrain[] | undefined>();
    const [trainTimetables, setTrainTimetables] = React.useState<Dictionary<TrainTimeTableRow[]> | undefined>();
    const [timetable, setTimetable] = React.useState<TimeTableRow[] | undefined>();
    const [players, setPlayers] = React.useState<ISteamUser[] | undefined>();
    const [tzOffset, setTzOffset] = React.useState<number | undefined>();
    const [trainsWithDetails, setTrainsWithDetails] = React.useState<{ [k: string]: DetailedTrain } | undefined>();
    const [isGraphModalOpen, setGraphModalOpen] = React.useState<boolean>(false);
    const [filterConfig, setFilterConfig] = React.useState<FilterConfig>(presetFilterConfig.default);
    const [serverTime, setServerTime] = React.useState<number | undefined>();
    const {t} = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const previousTrains = React.useRef<{ [k: string]: DetailedTrain } | null>(null);
    const previousPlayers = React.useRef<ISteamUser[] | undefined>(undefined);
    const graphFullScreenMode = !!useQueryParam("graphFullScreenMode", StringParam)[0];

    // Gets raw simrail data
    const fetchAllData = () => {
        if (!serverCode || !post) return;
        Promise.all([getTzOffset(serverCode), getServerTime(serverCode)]).then((v) => {
            setTzOffset(v[0]);
            setServerTime(v[1]);
            getTimetable(post, serverCode).then((data) => {
                setTimetable(data.sort((row1, row2) => row1.scheduledArrivalObject.valueOf() - row2.scheduledArrivalObject.valueOf()));
                getStations(serverCode).then((data) => {
                    setStations(_keyBy('Name', data));
                    getTrainsForPost(serverCode, post).then((data) => {
                        setTrains(data);
                        setLoading(false);
                    }).catch(() => {
                        enqueueSnackbar(t('EDR_train_refresh_failed'), { preventDuplicate: true, variant: 'error', autoHideDuration: 5000 });
                    });
                }).catch(() => {
                    enqueueSnackbar(t('EDR_station_refresh_failed'), { preventDuplicate: true, variant: 'error', autoHideDuration: 5000 });
                });
            }).catch(() => {
                enqueueSnackbar(t('EDR_timetable_refresh_failed'), { preventDuplicate: true, variant: 'error', autoHideDuration: 5000 });
            });
        }).catch(() => {
            enqueueSnackbar(t('EDR_timetable_refresh_failed'), { preventDuplicate: true, variant: 'error', autoHideDuration: 5000 });
        });
    }

    const currentStation = post ? postConfig[post] : undefined;

    // Launches the get from simrail
    React.useEffect(() => {
        setLoading(true);
        console_log("Current station : ", currentStation);
        if (!serverCode || !currentStation) return;
        fetchAllData();
        // eslint-disable-next-line
    }, [serverCode, post]);

    // Keeps previous data in memory for comparing changes
    React.useEffect(() => {
        previousTrains.current = trainsWithDetails as { [k: string]: DetailedTrain };
    }, [trainsWithDetails]);

    React.useEffect(() => {
        previousPlayers.current = players;
    }, [players]);

    // Refreshes the train positions every 10 seconds
    React.useEffect(() => {
        window.trainsRefreshWebWorkerId = window.setInterval(() => {
            if (!serverCode || !post) return;
            getTrainsForPost(serverCode, post).then(setTrains);
        }, 10000);
        if (!window.trainsRefreshWebWorkerId) {
            enqueueSnackbar(t('APP_fatal_error'), { preventDuplicate: true, variant: 'error', autoHideDuration: 10000 });
            return;
        }
        return () => window.clearInterval(window.trainsRefreshWebWorkerId);
        // eslint-disable-next-line
    }, [serverCode]);

    // Refreshes server time every 2 minutes
    React.useEffect(() => {
        window.serverTimeRefreshWebWorkerId = window.setInterval(() => {
            if (!serverCode) return;
            getServerTime(serverCode).then(setServerTime);
        }, 120000);
        if (!window.serverTimeRefreshWebWorkerId) {
            enqueueSnackbar(t('APP_fatal_error'), { preventDuplicate: true, variant: 'error', autoHideDuration: 10000 });
            return;
        }
        return () => window.clearInterval(window.serverTimeRefreshWebWorkerId);
        // eslint-disable-next-line
    }, [serverCode]);

    // Adds all the calculated infos for online trains. Such as distance or closest station for example
    React.useEffect(() => {
        if (loading || (trains as ExtendedTrain[]).length === 0 || !previousTrains || !trainTimetables) return;
        setTimeout(() => {
            const addDetailsToTrains = getTrainDetails(previousTrains, trainTimetables, nowUTC(serverTime));
            const onlineTrainsWithDetails = _map(addDetailsToTrains, trains);

            setTrainsWithDetails(_keyBy('TrainNoLocal', onlineTrainsWithDetails));
        }, 1);
        // eslint-disable-next-line
    }, [stations, JSON.stringify(trains), JSON.stringify(previousTrains.current), JSON.stringify(timetable), JSON.stringify(trainTimetables), serverTime]);

    // Get missing train timetables when a new train spawns on the map
    React.useEffect(() => {
        if (!trains || !serverCode) return;
        // Filter for trains that have a checkpoint at the current station
        const allTrainIds = trains.map((t) => (timetable as TimeTableRow[])?.findIndex(entry => entry.trainNoLocal === t.TrainNoLocal) > -1 ? t.TrainNoLocal: null).filter((trainNumber): trainNumber is Exclude<typeof trainNumber, null> => trainNumber !== null);
        const previousTrainIds = Object.keys(trainTimetables ?? []);
        const difference = _difference(allTrainIds, previousTrainIds);
        if (difference.length === 0) return;
        Promise.all(difference.map(trainId => getTrainTimetable(trainId, serverCode))).then((timetables) => {
            setTrainTimetables(groupBy(flatMap(timetables).concat(...Object.values(trainTimetables ?? {})), 'displayedTrainNumber'))
        });
    }, [trains, timetable, trainTimetables, serverCode])

    // Get new player info when someone takes over a train
    React.useEffect(() => {
        if (!trains) return;
        const allPlayerIds = trains.map((t) => t.TrainData.ControlledBySteamID).filter((trainNumber): trainNumber is Exclude<typeof trainNumber, null> => trainNumber !== null);
        const previousPlayerIds = previousPlayers?.current?.map(player => player.steamid) ?? [];
        const difference = _difference(allPlayerIds, previousPlayerIds);
        if (difference.length === 0) return;
        Promise.all(difference.map(getPlayer)).then(data => setPlayers(players !== undefined ? players?.concat(data) : data));
    }, [trains, players])

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
                              trainSchedules={trainTimetables}
        />

    return <>
        {
            timetable && tzOffset !== undefined && post && timetable.length && (isGraphModalOpen || graphFullScreenMode)
                ? <Graph
                    fullScreenMode={graphFullScreenMode}
                    isOpen={isGraphModalOpen}
                    timetable={timetable}
                    post={post} onClose={() =>
                    setGraphModalOpen(false)}
                    serverTime={serverTime}
                    serverCode={serverCode}
                />
                : null
        }
        { !graphFullScreenMode && tzOffset !== undefined && trainTimetables
            ? <EDRTable playSoundNotification={playSoundNotification}
                timetable={timetable!}
                serverTzOffset={tzOffset}
                trainsWithDetails={trainsWithDetails as { [k: string]: DetailedTrain }}
                post={post!}
                serverCode={serverCode!}
                isWebpSupported={isWebpSupported}
                filterConfig={filterConfig}
                setFilterConfig={setFilterConfig}
                players={players}
                trainTimetables={trainTimetables}
                serverTime={serverTime}
            />
            : null
        }
    </>
}

export default EDR;
