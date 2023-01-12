import React from "react";
import {configByType, postConfig, postToInternalIds} from "../config";
import {Badge, Checkbox, Progress, Spinner, Table} from "flowbite-react";
import {StringParam, useQueryParam} from "use-query-params";
import {useTranslation} from "react-i18next";
import set from "date-fns/set";
import {nowUTC} from "../utils/date";
import {getPlayer} from "../api/api";
import {PathFinding_HasTrainPassedStation} from "../pathfinding/api";

// TODO: Pass server tz
const iReallyNeedToAddADateLibrary = (expectedHours: number, expectedMinutes: number, tz: string) =>
    set(nowUTC(tz), {hours: expectedHours, minutes: expectedMinutes});

const getTimeDelay = (isNextDay: boolean, isPreviousDay: boolean, dateNow: Date, expected: Date) =>
    ((isNextDay && dateNow.getHours() < 22 ? 1 : 0) * -1444) + ((isPreviousDay && dateNow.getHours() < 22 ? 1 : 0) * (1444 * 2)) + ((dateNow.getHours() - expected.getHours()) * 60) + (dateNow.getMinutes() - expected.getMinutes());

const platformData = (ttRow: any ) => (
    <>
        {ttRow.layover} {ttRow.stop_type} {ttRow.platform && <>({ttRow.platform})</>}
    </>
)

const lineData = (ttRow: any) => (
    <>
        {ttRow.to}
        &nbsp;➡️️ <b>{ttRow.line}</b>
    </>
)

export const tableCellCommonClassnames = "p-4"

const RowPostData: React.FC<any> = ({ttRow, distanceFromStation, serverTz, headerFourthColRef, headerFifthColRef,headerSixthhColRef,headerSeventhColRef}) => {
    const {t} = useTranslation();
    const now = nowUTC(serverTz);
    const secondaryPostData = ttRow?.secondaryPostsRows ?? [];
    return <>
        <td className={tableCellCommonClassnames} ref={headerFourthColRef}>
            {ttRow.from}
            { secondaryPostData.map((spd: any) => <><hr />{spd.from}</>)}
        </td>
        <td className={tableCellCommonClassnames} ref={headerFifthColRef}>
            {platformData(ttRow)}
            { secondaryPostData.map((spd: any) => <><hr />{platformData(spd)}</>)}
        </td>
        <td className={tableCellCommonClassnames} style={{minWidth: 150}} ref={headerSixthhColRef}>
        <div className="inline-flex items-center justify-start h-full">
                {ttRow.scheduled_departure}
            </div>
            <div className="inline-flex items-center h-full pl-4">
                { 
                    distanceFromStation < 1 && new Date(now.getFullYear(), now.getMonth(), now.getDate(), ttRow.scheduled_departure.split(':')[0], ttRow.scheduled_departure.split(':')[1]) <= nowUTC(serverTz)
                        ? <Badge className="animate-pulse duration-1000" color="warning">{t('edr.train_row.train_departing')}</Badge>
                        : undefined
                }
            </div>
        </td>
        <td className={tableCellCommonClassnames} ref={headerSeventhColRef}>
            {lineData(ttRow)}
            { secondaryPostData.map((spd: any) => <><hr />{lineData(spd)}</>)}
        </td>
    </>;
}

// TODO: This is hella big. Needs refactoring !
const TableRow: React.FC<any> = (
    {ttRow, timeOffset, trainDetails, serverTz,
        firstColRef, secondColRef, thirdColRef, headerFourthColRef, headerFifthColRef, headerSixthhColRef, headerSeventhColRef
    }
) => {
    const [playerSteamInfo, setPlayerSteamInfo] = React.useState<any>();
    const [postQry] = useQueryParam('post', StringParam);
    const {t} = useTranslation();

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
    const trainConfig = configByType[ttRow.type as string];
    const postCfg = postConfig[postQry];
    const closestStationid = trainDetails?.closestStationId;
    const pathFindingLineTrace = trainDetails?.pfLineTrace;

    // This allows to check on the path, if the train is already far from station we can mark it already has passed without waiting for direction vector
    const initialPfHasPassedStation = pathFindingLineTrace ? PathFinding_HasTrainPassedStation(pathFindingLineTrace, postQry, ttRow.from, ttRow.to, closestStationid) : false;
    const trainBadgeColor = trainConfig?.color ?? "purple";
    const currentDistance = trainDetails?.rawDistances.slice(-1)
    const previousDistance = trainDetails?.rawDistances?.reduce((acc: number, v: number) => acc + v, 0) / (trainDetails?.distanceToStation?.length ?? 1);
    const distanceFromStation = Math.round(currentDistance * 100) / 100;
    const ETA = trainDetails?.TrainData?.Velocity ? (distanceFromStation / trainDetails.TrainData.Velocity) * 60 : undefined;
    const hasEnoughData = trainDetails?.distanceToStation.length > 2 || !trainDetails ;


    // console_log("Post cfg", postCfg);
    // TODO: It would be better to use a direction vector to calculate if its going to or away from the station, but my vector math looks off so this will do for now
    const trainHasPassedStation = initialPfHasPassedStation || (hasEnoughData ? closestStationid === postQry && currentDistance > previousDistance && distanceFromStation > postCfg.trainPosRange : false);
    const dateNow = nowUTC(serverTz);
    const [arrivalExpectedHours, arrivalExpectedMinutes] = ttRow.scheduled_arrival.split(":");
    const [departureExpectedHours, departureExpectedMinutes] = ttRow.scheduled_arrival.split(":");
    const isNextDay = Math.abs(arrivalExpectedHours - dateNow.getHours()) > 12; // TODO: Clunky
    const isPreviousDay = Math.abs(dateNow.getHours() - arrivalExpectedHours) > 12; // TODO: Clunky
    // console_log("Is next day ? " + ttRow.train_number, isNextDay);
    const expectedArrival = iReallyNeedToAddADateLibrary(arrivalExpectedHours, arrivalExpectedMinutes, serverTz);
    const expectedDeparture = iReallyNeedToAddADateLibrary(departureExpectedHours, departureExpectedMinutes, serverTz);
    const arrivalTimeDelay = getTimeDelay(isNextDay, isPreviousDay, dateNow, expectedArrival);
    const departureTimeDelay = getTimeDelay(isNextDay, isPreviousDay, dateNow, expectedDeparture);

    // ETA && console_log("ETA", ETA);
    return <Table.Row className="dark:text-gray-100 light:text-gray-800" style={{opacity: trainHasPassedStation ? 0.5 : 1}} data-timeoffset={timeOffset}>
        <td className={tableCellCommonClassnames} ref={firstColRef}>
            <div className="flex items-center justify-between">
                <Badge color={trainBadgeColor} size="sm"><span className="!font-bold">{ttRow.train_number}</span></Badge>
                {
                    !hasEnoughData && trainDetails?.TrainData?.Velocity > 0 && <span>⚠️ {t("edr.train_row.waiting_for_data")}</span>
                }
                {
                    playerSteamInfo?.pseudo
                        ? <span className="flex items-center"><img className="mx-2" width={16} src={playerSteamInfo.avatar} />{playerSteamInfo?.pseudo}</span>
                        : <></>
                }
                    <span className="none md:inline">{trainConfig && <img src={trainConfig.icon} height={50} width={64}/>}</span>

            </div>
            <div className="w-full">
                {  distanceFromStation
                    ? <>{t("edr.train_row.position_at")} {distanceFromStation}km ({trainDetails?.closestStation})</>
                    : <>{t('edr.train_row.train_offline')}</>
                }
                &nbsp;
                {
                        distanceFromStation
                        ? previousDistance == currentDistance
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
            <div className="flex items-center justify-start h-full">
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
        <RowPostData ttRow={ttRow} distanceFromStation={distanceFromStation} serverTz={serverTz} headerFourthColRef={headerFourthColRef} headerFifthColRef={headerFifthColRef} headerSixthhColRef={headerSixthhColRef} headerSeventhColRef={headerSeventhColRef} />
    </Table.Row>
}

export default React.memo(TableRow)