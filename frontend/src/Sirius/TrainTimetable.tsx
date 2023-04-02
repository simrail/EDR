import React from "react";
import {Badge, Table} from "flowbite-react";
import {Station, Train} from "@simrail/types";
import {postToInternalIds, StationConfig} from "../config/stations";
import {haversine} from "../EDR/functions/vectors";
import _minBy from "lodash/minBy";
import classNames from "classnames";
import TrainTimetableTimeline from "../EDR/components/TrainTimetableTimeline";
import INFO from "../images/icons/png/information.png";
import WARNING from "../images/icons/png/warning.png";
import INFO_WEBP from "../images/icons/webp/information.webp";
import WARNING_WEBP from "../images/icons/webp/warning.webp";
import { TrainTimeTableRow } from ".";
import Tooltip from "rc-tooltip";
import { useTranslation } from "react-i18next";
import { edrImagesMap } from "../config";
import { format } from "date-fns";
import { getPlayer, getStations } from "../api/api";
import { ISteamUser } from "../config/ISteamUser";
import { enqueueSnackbar } from "notistack";
import _difference from "lodash/difference";

type Props = {
    trainTimetable: TrainTimeTableRow[];
    train: Train;
    allStationsInpath: StationConfig[];
    autoScroll: boolean;
    isWebpSupported: boolean;
    serverCode: string | undefined;
    showSpeedLimits: boolean;
}

const stopTypeToLetters = (type: number | undefined) => {
    const stopType = type;
    switch (stopType) {
        case 1:
            return 'ph';
        case 2:
            return 'pt';
        default:
            return '';
    }
}

const scrollToNearestStation = (nearestStationId: string | undefined) => {
    const allTrainRows = [...Array.from(document.querySelectorAll('[data-internalId]').values())];
    const nearestStationRow = allTrainRows.find((e) => e.getAttribute("data-internalid") === nearestStationId)
    if (nearestStationRow) {
        nearestStationRow.scrollIntoView({
            block: "center"
        })
    }
}
export const TrainTimetable: React.FC<Props> = ({trainTimetable, allStationsInpath, train, autoScroll, isWebpSupported, serverCode, showSpeedLimits}) => {
    const [posts, setPosts] = React.useState<Station[] | undefined>();
    const [players, setPlayers] = React.useState<ISteamUser[] | undefined>();
    const {t} = useTranslation();

    const [trainLongitude, trainLatitude] = [train.TrainData.Longitute, train.TrainData.Latititute];
    const allStationsDistance = allStationsInpath.map((station) => {

        return {
            ...station,
            distance: haversine([trainLongitude, trainLatitude], station.platformPosOverride!)
        }
    })

    const nearestStation = _minBy(allStationsDistance, 'distance');
    const closestStationIndex = trainTimetable.map((s) => s.nameForPerson).findIndex((s) => s === nearestStation?.srId)

    const previousPlayers = React.useRef<ISteamUser[] | undefined>(undefined);

    React.useEffect(() => {
        previousPlayers.current = players;
    }, [players]);

    React.useEffect(() => {
        if (serverCode !== undefined) {
            getStations(serverCode).then(postData => {
                setPosts(postData);
                const steamIds = postData.map(post => post.DispatchedBy?.[0]?.SteamId).filter((steamId): steamId is Exclude<typeof steamId, undefined> => steamId !== undefined);;
                Promise.all(steamIds.map(getPlayer)).then(setPlayers);
            });
        }
    }, [serverCode]);

    React.useEffect(() => {
        window.stationsRefreshWebWorkerId = window.setInterval(() => {
            if (!serverCode) return;
            getStations(serverCode).then(setPosts);
        }, 20000);
        if (!window.stationsRefreshWebWorkerId) {
            enqueueSnackbar(t('APP_fatal_error'), { preventDuplicate: true, variant: 'error', autoHideDuration: 10000 });
            return;
        }
        return () => window.clearInterval(window.stationsRefreshWebWorkerId);
        // eslint-disable-next-line
    }, [serverCode]);

    React.useEffect(() => {
        if (!posts) return;
        const allPlayerIds = posts.map((t) => t.DispatchedBy?.[0]?.SteamId).filter((steamId): steamId is Exclude<typeof steamId, undefined> => steamId !== undefined);
        const previousPlayerIds = previousPlayers?.current?.map(player => player.steamid) ?? [];
        const difference = _difference(allPlayerIds, previousPlayerIds);
        if (difference.length === 0) return;
        Promise.all(difference.map(getPlayer)).then(data => setPlayers(players !== undefined ? players?.concat(data) : data));
    }, [posts, players])
    
    autoScroll && scrollToNearestStation(nearestStation?.id);
    return (
        <div className="h-full child:!rounded-none child:overflow-y-scroll child:h-full">
            <Table striped={true}>
                <Table.Body>
                    {
                        trainTimetable.map((ttRow, index: number) => {
                            const internalId = postToInternalIds[encodeURIComponent(ttRow.nameForPerson)]?.id;
                            const postDispatcher = players?.find(player => player.steamid === posts?.find(post => post.Name === ttRow.nameForPerson)?.DispatchedBy?.[0]?.SteamId);
                            return (
                                <React.Fragment key={`${ttRow.mileage}${ttRow.line}${ttRow.nameForPerson}}`}>
                                    <Table.Row
                                        className={classNames(
                                            "hover:bg-gray-200 dark:hover:bg-gray-600",
                                        {"!bg-amber-200 !text-gray-600 hover:!bg-amber-300": internalId === nearestStation?.id}
                                        )}
                                        data-internalid={internalId}
                                    >
                                        <Table.Cell className="relative pl-8">
                                            <div className="flex flex-col">
                                                <TrainTimetableTimeline itemIndex={index} closestStationIndex={closestStationIndex} isAtTheStation={index === closestStationIndex} stopType={ttRow.stopTypeNumber} />
                                                <div className="flex justify-between">
                                                    <span>{ttRow.mileage ? `${(Math.round(ttRow.mileage * 100) / 100)} km` : ''}</span>
                                                    <span>L{ttRow.line}</span>
                                                </div>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex justify-between">
                                            {ttRow.scheduledArrivalObject.getFullYear() > 1970 && (
                                                <span>{format(ttRow.scheduledArrivalObject, 'HH:mm')}</span>
                                            )}
                                                <span>{ttRow.stopTypeNumber > 0 && <Badge>{`${stopTypeToLetters(ttRow.stopTypeNumber)}`}</Badge>}</span>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="pl-0 flex justify-between">
                                            <span className="inline-block">{ttRow.nameForPerson}</span>
                                            <span className="inline-block">
                                                {
                                                    postDispatcher?.personaname
                                                        ? <span className="flex items-center"><span className="hidden md:inline">{postDispatcher?.personaname}</span><img className="mx-2" width={16} src={postDispatcher?.avatar} alt="avatar" /></span>
                                                        : <></>
                                                }
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {ttRow.scheduledDepartureObject.getFullYear() < 3000 && (
                                                <>
                                                    {format(ttRow.scheduledDepartureObject, 'HH:mm')}
                                                </>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {(Math.floor(ttRow.plannedStop) > 0 || ttRow.stopTypeNumber > 0) && <span className="flex">
                                                <Tooltip placement="top" overlay={<span>{t("EDR_TRAINROW_layover")}</span>}>
                                                    <img id="layover_test" className="h-[13px] lg:h-[26px] mx-2" src={edrImagesMap.LAYOVER} alt="layover" />
                                                </Tooltip>
                                                {ttRow.plannedStop}&nbsp;{t("EDR_TRAINROW_layover_minutes")}
                                            </span>}
                                        </Table.Cell>
                                    </Table.Row>
                                {
                                    showSpeedLimits && ttRow.speedLimitsToNextStation.map((sltn, _index: number) => {
                                        const vMaxHigh = parseInt(sltn.vMax) > 100;
                                        const vMaxMedium = parseInt(sltn.vMax) >= 70 && parseInt(sltn.vMax) <= 100;
                                        const vMaxLow = parseInt(sltn.vMax) < 70;
                                        if (_index > 0 && parseInt(ttRow.speedLimitsToNextStation[_index - 1].vMax) === parseInt(sltn.vMax)) {
                                            return <React.Fragment key={`${_index}-line-${sltn.lineNo}-track-${sltn.track}`}></React.Fragment>;
                                        }
                                        return (
                                            <Table.Row key={`${_index}-line-${sltn.lineNo}-track-${sltn.track}`} className={` ma-0`}>
                                                <Table.Cell className="relative pl-8">
                                                    <TrainTimetableTimeline renderOnlyLine itemIndex={index} closestStationIndex={closestStationIndex} isAtTheStation={index === closestStationIndex} />
                                                    <div className="flex ">
                                                        <span>{Math.round(sltn.axisStart * 10) / 10} km</span>
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                </Table.Cell>
                                                <Table.Cell className={`
                                                    ${vMaxHigh ? '!text-green-900 !bg-green-100 hover:!bg-green-200 dark:!bg-green-300 dark:hover:!bg-green-200' : ''}
                                                    ${vMaxMedium ? '!text-yellow-900 !bg-yellow-100 hover:!bg-yellow-200 dark:!bg-yellow-300 dark:hover:!bg-yellow-200' : ''}
                                                    ${vMaxLow ? '!text-red-900 !bg-red-100 hover:!bg-red-200 dark:!bg-red-300 dark:hover:!bg-red-200' : ''}
                                                `}>
                                                    <span>
                                                        {vMaxHigh && (
                                                            <img src={isWebpSupported? INFO_WEBP : INFO} height="16" width="16" alt="info icon" className="inline pb-1 pr-1" />
                                                        )}
                                                        {vMaxMedium && (
                                                            <img src={isWebpSupported? INFO_WEBP : INFO} height="16" width="16" alt="info icon" className="inline pb-1 pr-1"/>
                                                        )}
                                                        {vMaxLow && (
                                                            <img src={isWebpSupported? WARNING_WEBP : WARNING} height="16" width="16" alt="warning icon" className="inline pb-1 pr-1"/>
                                                        )}
                                                        
                                                        {sltn.vMax} km/h
                                                    </span>
                                                </Table.Cell>
                                                <Table.Cell colSpan={10}>

                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    })
                                }
                            </React.Fragment>
                            )
                        })
                    }
                </Table.Body>
            </Table>

        </div>
    )
}
