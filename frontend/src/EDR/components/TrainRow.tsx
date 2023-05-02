import React from "react";
import {Table} from "flowbite-react";
import {nowUTC} from "../../utils/date";
import { getDateWithHourAndMinutes } from "../functions/timeUtils";
import {configByType} from "../../config/trains";
import {FilterConfig} from "..";
import { DetailedTrain } from "../functions/trainDetails";
import { format, subMinutes } from "date-fns";
import {TrainInfoCell} from "./Cells/TrainInfoCell";
import {TrainTypeCell} from "./Cells/TrainTypeCell";
import {TrainArrivalCell} from "./Cells/TrainArrivalCell";
import {TrainFromCell} from "./Cells/TrainFromCell";
import {TrainPlatformCell} from "./Cells/TrainPlatformCell";
import {TrainDepartureCell} from "./Cells/TrainDepartureCell";
import {TrainToCell} from "./Cells/TrainToCell";
import { ISteamUser } from "../../config/ISteamUser";
import { StationConfig } from "../../config/stations";
import { TimeTableRow } from "../../customTypes/TimeTableRow";


export const tableCellCommonClassnames = (streamMode: boolean = false) => streamMode ? "p-2" : "p-4";
type Props = {
    setModalTrainId: React.Dispatch<React.SetStateAction<string | undefined>>,
    setTimetableTrainId: React.Dispatch<React.SetStateAction<string | undefined>>,
    ttRow: TimeTableRow,
    trainDetails: DetailedTrain,
    serverTzOffset: number,
    firstColRef: any,
    secondColRef: any,
    thirdColRef: any,
    headerFourthColRef: any,
    headerFifthColRef: any,
    headerSixthhColRef: any,
    headerSeventhColRef: any,
    playSoundNotification: any,
    isWebpSupported: boolean,
    streamMode: boolean;
    filterConfig: FilterConfig;
    serverCode: string;
    players: ISteamUser[] | undefined;
    postCfg: StationConfig;
}

const TableRow: React.FC<Props> = (
    {setModalTrainId, ttRow, trainDetails, serverTzOffset,
        firstColRef, secondColRef, thirdColRef, headerFourthColRef, headerFifthColRef, headerSixthhColRef, headerSeventhColRef,
        playSoundNotification, isWebpSupported, streamMode, setTimetableTrainId, filterConfig,
        serverCode, players, postCfg
    }: Props
) => {
    const dateNow = nowUTC(serverTzOffset);

    const trainHasPassedStation = trainDetails?.TrainData.VDDelayedTimetableIndex > Math.max(ttRow.stationIndex, ...(ttRow.secondaryPostsRows || []).map(row => row.stationIndex));
    const departureExpectedHours = ttRow.scheduledDepartureObject.getHours();
    const departureExpectedMinutes = ttRow.scheduledDepartureObject.getMinutes();
    // console_log("Is next day ? " + ttRow.train_number, isNextDay);
    const isDepartureNextDay = dateNow.getHours() >= 20 && departureExpectedHours < 12;  // TODO: less but still clunky
    const isDeparturePreviousDay = departureExpectedHours >= 20 && dateNow.getHours() < 12; // TODO: less but still Clunky
    const expectedDeparture = getDateWithHourAndMinutes(dateNow, departureExpectedHours, departureExpectedMinutes, isDepartureNextDay, isDeparturePreviousDay);

    const arrivalExpectedHours = ttRow.scheduledArrivalObject.getHours();
    const arrivalExpectedMinutes = ttRow.scheduledArrivalObject.getMinutes();
    const isArrivalNextDay = dateNow.getHours() >= 20 && arrivalExpectedHours < 12;  // TODO: less but still clunky
    const isArrivalPreviousDay = arrivalExpectedHours >= 20 && dateNow.getHours() < 12; // TODO: less but still Clunky
    const expectedArrival = getDateWithHourAndMinutes(dateNow, arrivalExpectedHours, arrivalExpectedMinutes, isArrivalNextDay, isArrivalPreviousDay);
    const arrivalTimeDelay = trainDetails?.lastDelay ? trainDetails.lastDelay : 0;

    const trainMustDepart = !trainHasPassedStation && trainDetails?.distanceFromStation < 1.5 && (subMinutes(expectedDeparture, 1) <= dateNow); // 1.5 for temporary zawierce freight fix
    const trainBadgeColor = configByType[ttRow.trainType]?.color ?? "purple";
    const secondaryPostData = ttRow?.secondaryPostsRows ?? [];

    if (filterConfig.onlyApproaching && (trainHasPassedStation || !trainDetails)) return null;
    if (filterConfig.maxRange && trainDetails?.distanceFromStation > filterConfig.maxRange) return null;
    const expectedArrivalIninutes = (expectedArrival.getHours() * 60 + expectedArrival.getMinutes()) - (dateNow.getHours() * 60 + dateNow.getMinutes());
    if (filterConfig.maxTime && Math.abs(expectedArrivalIninutes) > filterConfig.maxTime) return null;


    return <Table.Row
        className={`
            dark:text-gray-100 light:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 
            ${trainHasPassedStation || !trainDetails ? 'opacity-50' : 'opacity-100'}
        `} data-timeoffset={Math.abs(parseInt(format(dateNow, "HHmm")) - parseInt(format(ttRow.scheduledArrivalObject, 'HHmm')))}
    >
        <TrainInfoCell
            ttRow={ttRow}
            trainDetails={trainDetails}
            trainBadgeColor={trainBadgeColor}
            setModalTrainId={setModalTrainId}
            setTimetableTrainId={setTimetableTrainId}
            firstColRef={firstColRef}
            trainHasPassedStation={trainHasPassedStation}
            isWebpSupported={isWebpSupported}
            streamMode={streamMode}
            serverCode={serverCode}
            players={players}
            postCfg={postCfg}
        />
        <TrainTypeCell
            secondColRef={secondColRef}
            trainBadgeColor={trainBadgeColor}
            trainDetails={trainDetails}
            ttRow={ttRow}
            streamMode={streamMode}
        />
        <TrainArrivalCell
            ttRow={ttRow}
            trainDetails={trainDetails}
            dateNow={dateNow}
            serverTzOffset={serverTzOffset}
            trainHasPassedStation={trainHasPassedStation}
            expectedDeparture={expectedDeparture}
            thirdColRef={thirdColRef}
            streamMode={streamMode}
            arrivalTimeDelay={arrivalTimeDelay}
        />
        <TrainFromCell headerFourthColRef={headerFourthColRef} ttRow={ttRow} secondaryPostData={secondaryPostData}
                       streamMode={streamMode} />
        <TrainPlatformCell ttRow={ttRow} headerFifthColRef={headerFifthColRef} secondaryPostData={secondaryPostData}
                           streamMode={streamMode} />
        <TrainDepartureCell
            headerSixthhColRef={headerSixthhColRef}
            ttRow={ttRow}
            trainHasPassedStation={trainHasPassedStation}
            trainMustDepart={trainMustDepart}
            playSoundNotification={playSoundNotification}
            streamMode={streamMode}
            isTrainOffline={!trainDetails}
        />
        <TrainToCell ttRow={ttRow} headerSeventhColRef={headerSeventhColRef} secondaryPostData={secondaryPostData}
                     streamMode={streamMode}/>
    </Table.Row>
}

export default React.memo(TableRow, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.trainDetails) === JSON.stringify(nextProps.trainDetails)
    && JSON.stringify(prevProps.ttRow) === JSON.stringify(nextProps.ttRow)
    && JSON.stringify(prevProps.filterConfig) === JSON.stringify(nextProps.filterConfig)
})