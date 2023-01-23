import React from "react";
import {edrImagesMap} from "../../config";
import {Badge, Button, Table} from "flowbite-react";
import {StringParam, useQueryParam} from "use-query-params";
import {useTranslation} from "react-i18next";
import {nowUTC} from "../../utils/date";
import {getPlayer} from "../../api/api";
import {PathFinding_HasTrainPassedStation} from "../../pathfinding/api";
import World from "../../sounds/world.svg";
import {CellLineData} from "./CellLineData";
import {getDateWithHourAndMinutes, getTimeDelay} from "../functions/timeUtils";
import {configByLoco, configByType} from "../../config/trains";
import {postConfig} from "../../config/stations";
import { TimeTableRow } from "..";
import { DetailedTrain } from "../functions/trainDetails";
import { subMinutes } from "date-fns";

const PlatformData: React.FC<{ttRow: TimeTableRow}> = ({ttRow}) => {
    const {t} = useTranslation();
    return ttRow.platform || Math.ceil(parseInt(ttRow.layover)) !== 0 ? (
        <>
            <img className="inline-block pr-1" src={edrImagesMap.LAYOVER} height={26} width={26} alt="layover"/> {Math.floor(parseInt(ttRow.layover))} {t("edr.train_row.layover_minutes")}
            {ttRow.platform && <><img className="ml-2 inline-block pl-1" src={edrImagesMap.TRACK} height={26} width={26} alt="track"/> {ttRow.platform.split(' ')[0]} / {ttRow.platform.split(' ')[1]}</>}
        </>
    ) : null
}

export const tableCellCommonClassnames = "p-4"

const RowPostData: React.FC<any> = ({playSoundNotification, ttRow, trainMustDepart, trainHasPassedStation, headerFourthColRef, headerFifthColRef,headerSixthhColRef,headerSeventhColRef}) => {
    const {t} = useTranslation();
    const secondaryPostData = ttRow?.secondaryPostsRows ?? [];

    const [notificationEnabled, setNotificationEnabled] = React.useState(false);

    React.useEffect(() => {
        if (trainMustDepart && notificationEnabled)
            playSoundNotification(() => setNotificationEnabled(false));
        // eslint-disable-next-line
    }, [notificationEnabled, trainMustDepart]);

    return <>
        <td className={tableCellCommonClassnames} ref={headerFourthColRef}>
            {ttRow.from}
            { secondaryPostData.map((spd: TimeTableRow) => <><hr />{spd.from}</>)}
        </td>
        <td className={tableCellCommonClassnames} ref={headerFifthColRef}>
            <PlatformData ttRow={ttRow} />
            { secondaryPostData.map((spd: TimeTableRow) => <><hr /><PlatformData ttRow={spd} /></>)}
        </td>
        <td className={tableCellCommonClassnames} style={{minWidth: 150}} ref={headerSixthhColRef}>
            <div className="flex items-center justify-start h-full">
                {ttRow.scheduled_departure}
                <div className="inline-flex items-center h-full pl-4">
                    {
                        !trainHasPassedStation && (trainMustDepart ?
                            <Badge className="animate-pulse duration-1000" color="warning">{t('edr.train_row.train_departing')}</Badge>
                            :
                            <Button outline color="light" className="dark:bg-slate-200" pill size="xs">
                                <img height={16} width={16} src={notificationEnabled ? edrImagesMap.CHECK : edrImagesMap.BELL} alt={t("edr.train_row.notify") ?? 'notify'} onClick={() => setNotificationEnabled(!notificationEnabled)}/>
                            </Button>
                        )
                    }
                </div>
            </div>
        </td>
        <td className={tableCellCommonClassnames} ref={headerSeventhColRef}>
            <CellLineData ttRow={ttRow} />
            { secondaryPostData.map((spd: TimeTableRow, i: number) => <><hr /><CellLineData ttRow={spd} key={spd.train_number + i} /></>)}
        </td>
    </>;
}

type Props = {
    setModalTrainId: React.Dispatch<React.SetStateAction<string | undefined>>,
    ttRow: TimeTableRow,
    timeOffset: number,
    trainDetails: DetailedTrain,
    serverTz: string,
    firstColRef: any,
    secondColRef: any,
    thirdColRef: any,
    headerFourthColRef: any,
    headerFifthColRef: any,
    headerSixthhColRef: any,
    headerSeventhColRef: any,
    playSoundNotification: any,
}

// TODO: This is hella big. Needs refactoring !
const TableRow: React.FC<Props> = (
    {setModalTrainId, ttRow, timeOffset, trainDetails, serverTz,
        firstColRef, secondColRef, thirdColRef, headerFourthColRef, headerFifthColRef, headerSixthhColRef, headerSeventhColRef,
        playSoundNotification
    }: Props
) => {
    const [playerSteamInfo, setPlayerSteamInfo] = React.useState<any>();
    const [postQry] = useQueryParam('post', StringParam);
    const {t} = useTranslation();
    const dateNow = nowUTC(serverTz);

    const controlledBy = trainDetails?.TrainData?.ControlledBySteamID;

    React.useEffect(() => {
        if (!controlledBy) {
            setPlayerSteamInfo(undefined);
            return;
        }
        getPlayer(controlledBy).then((res) => {
            if (res[0])
                setPlayerSteamInfo(res[0]);
        })
    }, [controlledBy]);


    if (!postQry) return null;
    const trainConfig = configByLoco[trainDetails?.Vehicles[0]] ?? configByType[ttRow.type];
    const postCfg = postConfig[postQry];
    const closestStationid = trainDetails?.closestStationId;
    const pathFindingLineTrace = trainDetails?.pfLineTrace;

    const currentDistance = trainDetails?.rawDistances.slice(-1)[0];
    // This allows to check on the path, if the train is already far from station we can mark it already has passed without waiting for direction vector
    const initialPfHasPassedStation = pathFindingLineTrace ? PathFinding_HasTrainPassedStation(pathFindingLineTrace, postQry, ttRow.from, ttRow.to, closestStationid, currentDistance) : false;
    const trainBadgeColor = configByType[ttRow.type]?.color ?? "purple";
    const previousDistance = trainDetails?.rawDistances?.reduce((acc: number, v: number) => acc + v, 0) / (trainDetails?.distanceToStation?.length ?? 1);
    const distanceFromStation = Math.round(currentDistance * 100) / 100;
    const ETA = trainDetails?.TrainData?.Velocity ? (distanceFromStation / trainDetails.TrainData.Velocity) * 60 : undefined;
    const hasEnoughData = trainDetails?.distanceToStation.length > 2 || !trainDetails ;

    // console_log("Post cfg", postCfg);
    // TODO: It would be better to use a direction vector to calculate if its going to or away from the station, but my vector math looks off so this will do for now
    const trainHasPassedStation = initialPfHasPassedStation || (hasEnoughData ? closestStationid === postQry && currentDistance > previousDistance && distanceFromStation > postCfg.trainPosRange : false);
    const [arrivalExpectedHours, arrivalExpectedMinutes] = ttRow.scheduled_arrival.split(":").map(value => parseInt(value));
    const [departureExpectedHours, departureExpectedMinutes] = ttRow.scheduled_departure.split(":").map(value => parseInt(value));
    const isArrivalNextDay = dateNow.getHours() > 20 && arrivalExpectedHours < 12;  // TODO: less but still clunky
    const isArrivalPreviousDay = arrivalExpectedHours > 20 && dateNow.getHours() < 12; // TODO: less but still Clunky
    // console_log("Is next day ? " + ttRow.train_number, isNextDay);
    const expectedArrival = getDateWithHourAndMinutes(arrivalExpectedHours, arrivalExpectedMinutes, serverTz);
    const expectedDeparture = getDateWithHourAndMinutes(departureExpectedHours, departureExpectedMinutes, serverTz);
    const arrivalTimeDelay = getTimeDelay(isArrivalNextDay, isArrivalPreviousDay, dateNow, expectedArrival);
    const departureTimeDelay = getTimeDelay(isArrivalNextDay, isArrivalPreviousDay, dateNow, expectedDeparture);
    const trainMustDepart = !trainHasPassedStation && distanceFromStation < 1.5 && (subMinutes(expectedDeparture, 1) <= dateNow); // 1.5 for temporary zawierce freight fix

    // ETA && console_log("ETA", ETA);
    return <Table.Row className="dark:text-gray-100 light:text-gray-800" style={{opacity: trainHasPassedStation ? 0.5 : 1}} data-timeoffset={timeOffset}>
        <td className={tableCellCommonClassnames} ref={firstColRef}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Badge color={trainBadgeColor} size="sm"><span className="!font-bold text-lg">{ttRow.train_number}</span></Badge>
                    { trainDetails && <span className="ml-2">
                        <Button size="xs" onClick={() => !!trainDetails && setModalTrainId(ttRow.train_number)}><img src={World} height={16} width={16} alt="Show on map"/></Button>
                    </span> }
                </div>
                <div className="flex md:inline">
                    <div className="flex justify-end">
                        {trainConfig?.icon && <img src={trainConfig.icon} height={50} width={64} alt="train-icon"/>}
                    </div>
                    <div className="flex justify-center">
                        {
                            !hasEnoughData && trainDetails?.TrainData?.Velocity > 0 && <span>⚠️ {t("edr.train_row.waiting_for_data")}</span>
                        }
                        {
                            playerSteamInfo?.pseudo
                                ? <span className="flex items-center"><img className="mx-2" width={16} src={playerSteamInfo.avatar} alt="avatar" />{playerSteamInfo?.pseudo}</span>
                                : <></>
                        }
                    </div>
                </div>
            </div>
            <div className="w-full">
                {  distanceFromStation
                    ? <>{t("edr.train_row.position_at")} {distanceFromStation}km ({trainDetails?.closestStation})</>
                    : <>{t('edr.train_row.train_offline')}</>
                }
                &nbsp;
                {
                        distanceFromStation
                        ? previousDistance === currentDistance
                            ? <>&nbsp;- {t('edr.train_row.train_stopped')}</>
                            : trainHasPassedStation ?
                                <>&nbsp;- {t("edr.train_row.train_away")}</>
                                : ETA && Math.round(ETA) < 20
                                ? <>&nbsp;- {Math.round(ETA)}{t("edr.train_row.train_minutes")}</>
                                : trainDetails?.TrainData?.Velocity === 0 ? <>&nbsp;- {t('edr.train_row.train_stopped')}</> : undefined
                : undefined
                }
            </div>
        </td>
        <td className={tableCellCommonClassnames}  ref={secondColRef}>
            <div className="flex justify-center items-center flex-col space-around">
                <Badge className="" color={trainBadgeColor}>{ttRow.type}</Badge>&nbsp;
                {Math.floor(trainDetails?.TrainData?.Velocity) || 0}/{ttRow.type_speed ?? '??'}km/h
            </div>
        </td>
        <td className={tableCellCommonClassnames} ref={thirdColRef}>
            <div className="flex items-center justify-center h-full">
            {ttRow.scheduled_arrival}&nbsp;
                {
                    !trainHasPassedStation && arrivalTimeDelay > 0 && trainDetails
                        ? <span className="text-red-600 font-bold">{t("edr.train_row.train_late_sign")}{arrivalTimeDelay}</span>
                        : undefined
                }

                {
                    !trainHasPassedStation && arrivalTimeDelay < 0 && trainDetails
                        ? <span className="text-green-600 font-bold">{t("edr.train_row.train_early_sign")}{Math.abs(arrivalTimeDelay)}</span>
                        : undefined
                }

            </div>
            <div className="flex justify-center">
            {
                !trainHasPassedStation && arrivalTimeDelay > 5 && trainDetails && departureTimeDelay > 0
                    ? <Badge className="animate-pulse duration-1000" color="failure">{t('edr.train_row.train_delayed')}</Badge>
                    : undefined
            }
            {
                !trainHasPassedStation && arrivalTimeDelay < -5 && distanceFromStation < 4 &&  trainDetails
                    ? <Badge className="animate-pulse" color="info">{t('edr.train_row.train_early')}</Badge>
                    : undefined
            }
            </div>
        </td>
        <RowPostData playSoundNotification={playSoundNotification} ttRow={ttRow} trainHasPassedStation={trainHasPassedStation} trainMustDepart={trainMustDepart} headerFourthColRef={headerFourthColRef} headerFifthColRef={headerFifthColRef} headerSixthhColRef={headerSixthhColRef} headerSeventhColRef={headerSeventhColRef} />
    </Table.Row>
}

export default React.memo(TableRow)