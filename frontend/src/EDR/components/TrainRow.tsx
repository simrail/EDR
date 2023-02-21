import React from "react";
import {Table} from "flowbite-react";
import {nowUTC} from "../../utils/date";
import {PathFinding_HasTrainPassedStation} from "../../pathfinding/api";
import {getDateWithHourAndMinutes, getTimeDelay} from "../functions/timeUtils";
import {configByType} from "../../config/trains";
import {postConfig} from "../../config/stations";
import {FilterConfig, TimeTableRow} from "..";
import { DetailedTrain } from "../functions/trainDetails";
import { subMinutes } from "date-fns";
import {TrainInfoCell} from "./Cells/TrainInfoCell";
import {TrainTypeCell} from "./Cells/TrainTypeCell";
import {TrainArrivalCell} from "./Cells/TrainArrivalCell";
import {TrainFromCell} from "./Cells/TrainFromCell";
import {TrainPlatformCell} from "./Cells/TrainPlatformCell";
import {TrainDepartureCell} from "./Cells/TrainDepartureCell";
import {TrainToCell} from "./Cells/TrainToCell";


export const tableCellCommonClassnames = (streamMode: boolean = false) => streamMode ? "p-2" : "p-4";
type Props = {
    setModalTrainId: React.Dispatch<React.SetStateAction<string | undefined>>,
    setTimetableTrainId: React.Dispatch<React.SetStateAction<string | undefined>>,
    ttRow: TimeTableRow,
    timeOffset: number,
    trainDetails: DetailedTrain,
    serverTzOffset: number,
    post: string;
    firstColRef: any,
    secondColRef: any,
    thirdColRef: any,
    headerFourthColRef: any,
    headerFifthColRef: any,
    headerSixthhColRef: any,
    headerSeventhColRef: any,
    playSoundNotification: any,
    isWebpSupported: boolean,
    showOnlyApproachingTrains: boolean;
    streamMode: boolean;
    filterConfig: FilterConfig;
}

const TableRow: React.FC<Props> = (
    {setModalTrainId, ttRow, timeOffset, trainDetails, serverTzOffset, post,
        firstColRef, secondColRef, thirdColRef, headerFourthColRef, headerFifthColRef, headerSixthhColRef, headerSeventhColRef,
        playSoundNotification, isWebpSupported, showOnlyApproachingTrains, streamMode, setTimetableTrainId, filterConfig
    }: Props
) => {
    const dateNow = nowUTC(serverTzOffset);
    
    // if (!post) return null;
    const postCfg = postConfig[post];
    const closestStationid = trainDetails?.closestStationId;
    const pathFindingLineTrace = trainDetails?.pfLineTrace;

    const currentDistance = trainDetails?.rawDistances.slice(-1)[0];
    // This allows to check on the path, if the train is already far from station we can mark it already has passed without waiting for direction vector
    const initialPfHasPassedStation = pathFindingLineTrace ? PathFinding_HasTrainPassedStation(pathFindingLineTrace, post, ttRow.from, ttRow.to, closestStationid, currentDistance) : false;
    const previousDistance = trainDetails?.rawDistances?.reduce((acc: number, v: number) => acc + v, 0) / (trainDetails?.distanceToStation?.length ?? 1);
    const distanceFromStation = Math.round(currentDistance * 100) / 100;
    const hasEnoughData = trainDetails?.distanceToStation.length > 2 || !trainDetails ;

    // console_log("Post cfg", postCfg);
    // TODO: It would be better to use a direction vector to calculate if its going to or away from the station, but my vector math looks off so this will do for now
    const trainHasPassedStation = initialPfHasPassedStation || (hasEnoughData ? closestStationid === post && currentDistance > previousDistance && distanceFromStation > postCfg.trainPosRange : false);
    const [departureExpectedHours, departureExpectedMinutes] = ttRow.scheduled_departure.split(":").map(value => parseInt(value));
    // console_log("Is next day ? " + ttRow.train_number, isNextDay);
    const isDepartureNextDay = dateNow.getHours() >= 20 && departureExpectedHours < 12;  // TODO: less but still clunky
    const isDeparturePreviousDay = departureExpectedHours >= 20 && dateNow.getHours() < 12; // TODO: less but still Clunky
    const expectedDeparture = getDateWithHourAndMinutes(dateNow, departureExpectedHours, departureExpectedMinutes, isDepartureNextDay, isDeparturePreviousDay);

    const [arrivalExpectedHours, arrivalExpectedMinutes] = ttRow.scheduled_arrival.split(":").map(value => parseInt(value));
    const isArrivalNextDay = dateNow.getHours() >= 20 && arrivalExpectedHours < 12;  // TODO: less but still clunky
    const isArrivalPreviousDay = arrivalExpectedHours >= 20 && dateNow.getHours() < 12; // TODO: less but still Clunky
    const expectedArrival = getDateWithHourAndMinutes(dateNow, arrivalExpectedHours, arrivalExpectedMinutes, isArrivalNextDay, isArrivalPreviousDay);
    const arrivalTimeDelay = getTimeDelay(dateNow, expectedArrival);
    const departureTimeDelay = getTimeDelay(dateNow, expectedDeparture);

    const trainMustDepart = !trainHasPassedStation && distanceFromStation < 1.5 && (subMinutes(expectedDeparture, 1) <= dateNow); // 1.5 for temporary zawierce freight fix
    const trainBadgeColor = configByType[ttRow.type]?.color ?? "purple";
    const secondaryPostData = ttRow?.secondaryPostsRows ?? [];

    // console.log("EDR", trainDetails)


    // ETA && console_log("ETA", ETA);

    if (filterConfig.onlyApproaching && (trainHasPassedStation || !trainDetails)) return null;
    if (filterConfig.maxRange && distanceFromStation > filterConfig.maxRange) return null;
    const expectedArrivalIninutes = (expectedArrival.getHours() * 60 + expectedArrival.getMinutes()) - (dateNow.getHours() * 60 + dateNow.getMinutes());
    if (filterConfig.maxTime && Math.abs(expectedArrivalIninutes) > filterConfig.maxTime) return null;

    return <Table.Row className="snap-start dark:text-gray-100 light:text-gray-800" style={{opacity: trainHasPassedStation ? 0.5 : 1}} data-timeoffset={timeOffset}>
        <TrainInfoCell
            ttRow={ttRow}
            trainDetails={trainDetails}
            trainBadgeColor={trainBadgeColor}
            hasEnoughData={hasEnoughData}
            setModalTrainId={setModalTrainId}
            setTimetableTrainId={setTimetableTrainId}
            firstColRef={firstColRef}
            distanceFromStation={distanceFromStation}
            currentDistance={currentDistance}
            previousDistance={previousDistance}
            trainHasPassedStation={trainHasPassedStation}
            isWebpSupported={isWebpSupported}
            streamMode={streamMode}
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
            distanceFromStation={distanceFromStation}
            thirdColRef={thirdColRef}
            streamMode={streamMode}
            arrivalTimeDelay={arrivalTimeDelay}
            departureTimeDelay={departureTimeDelay}
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
        />
        <TrainToCell ttRow={ttRow} headerSeventhColRef={headerSeventhColRef} secondaryPostData={secondaryPostData}
                     streamMode={streamMode}/>
    </Table.Row>
}

export default React.memo(TableRow)