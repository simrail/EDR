import React from "react";
import {configByType, postConfig, postToInternalIds} from "../config";
import {Badge, Checkbox, Progress, Spinner, Table} from "flowbite-react";
import {StringParam, useQueryParam} from "use-query-params";
import {useTranslation} from "react-i18next";
import set from "date-fns/set";
import {nowUTC} from "../utils/date";

// TODO: Pass server tz
const iReallyNeedToAddADateLibrary = (expectedHours: number, expectedMinutes: number, tz: string) =>
    set(nowUTC(tz), {hours: expectedHours, minutes: expectedMinutes});

const getTimeDelay = (isNextDay: boolean, isPreviousDay: boolean, dateNow: Date, expected: Date) =>
    ((isNextDay ? 1 : 0) * -1444) + ((isPreviousDay ? 1 : 0) * 1444) + ((dateNow.getHours() - expected.getHours()) * 60) + (dateNow.getMinutes() - expected.getMinutes());

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

const RowPostData: React.FC<any> = ({ttRow, headerFourthColRef, headerFifthColRef,headerSixthhColRef,headerSeventhColRef}) => {
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
            {ttRow.scheduled_departure}
        </td>
        <td className={tableCellCommonClassnames} ref={headerSeventhColRef}>
            {lineData(ttRow)}
            { secondaryPostData.map((spd: any) => <><hr />{lineData(spd)}</>)}
        </td>
    </>;
}

export const TableRow: React.FC<any> = (
    {ttRow, timeOffset, trainDetails, serverTz,
        firstColRef, secondColRef, thirdColRef, headerFourthColRef, headerFifthColRef, headerSixthhColRef, headerSeventhColRef
    }
) => {
    const [postQry] = useQueryParam('post', StringParam);
    const {t} = useTranslation();
    if (!postQry) return null;
    const trainConfig = configByType[ttRow.type as string];
    const postCfg = postConfig[postQry];
    const trainBadgeColor = trainConfig?.color ?? "purple";
    const currentDistance = trainDetails?.distanceToStation.slice(-1)
    const previousDistance = trainDetails?.distanceToStation.slice(-2)
    const distanceFromStation = Math.round(currentDistance * 100) / 100;
    const ETA = trainDetails?.TrainData?.Velocity ? (distanceFromStation / trainDetails.TrainData.Velocity) * 60 : undefined;
    const hasEnoughData = trainDetails?.distanceToStation.length > 2 || !trainDetails ;


    // console.log("Post cfg", postCfg);
    const trainHasPassedStation = hasEnoughData && currentDistance > previousDistance && distanceFromStation > postCfg.trainPosRange;
    const dateNow = nowUTC(serverTz);
    const [arrivalExpectedHours, arrivalExpectedMinutes] = ttRow.scheduled_arrival.split(":");
    const [departureExpectedHours, departureExpectedMinutes] = ttRow.scheduled_arrival.split(":");
    const isNextDay = Math.abs(arrivalExpectedHours - dateNow.getHours()) > 12; // TODO: Clunky
    const isPreviousDay = Math.abs(dateNow.getHours() - arrivalExpectedHours) > 12; // TODO: Clunky
    // console.log("Is next day ? " + ttRow.train_number, isNextDay);
    const expectedArrival = iReallyNeedToAddADateLibrary(arrivalExpectedHours, arrivalExpectedMinutes, serverTz);
    const expectedDeparture = iReallyNeedToAddADateLibrary(departureExpectedHours, departureExpectedMinutes, serverTz);
    const arrivalTimeDelay = getTimeDelay(isNextDay, isPreviousDay, dateNow, expectedArrival);
    const departureTimeDelay = getTimeDelay(isNextDay, isPreviousDay, dateNow, expectedDeparture);

    // ETA && console.log("ETA", ETA);
    return <Table.Row className="dark:text-gray-100 light:text-gray-800" style={{opacity: trainHasPassedStation ? 0.5 : 1}} data-timeoffset={timeOffset}>
        <td className={tableCellCommonClassnames} ref={firstColRef}>
            <div className="flex items-center justify-between">
                <Badge color={trainBadgeColor}>{ttRow.train_number}</Badge>

                {
                    !hasEnoughData && trainDetails?.TrainData?.Velocity > 0 && <span>⚠️ Waiting for data.</span>
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
                        ? <span className="text-red-600 font-bold">-{arrivalTimeDelay}</span>
                        : undefined
                }

                {
                    !trainHasPassedStation && arrivalTimeDelay < 0 && trainDetails
                        ? <span className="text-green-600 font-bold">+{Math.abs(arrivalTimeDelay)}</span>
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
        <RowPostData ttRow={ttRow} headerFourthColRef={headerFourthColRef} headerFifthColRef={headerFifthColRef} headerSixthhColRef={headerSixthhColRef} headerSeventhColRef={headerSeventhColRef} />
    </Table.Row>
}