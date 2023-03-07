import React from "react";
import {Table} from "flowbite-react";
import {Train} from "@simrail/types";
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

type Props = {
    trainTimetable: TrainTimeTableRow[];
    train: Train;
    allStationsInpath: StationConfig[];
    autoScroll: boolean;
    isWebpSupported: boolean;
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
export const TrainTimetable: React.FC<Props> = ({trainTimetable, allStationsInpath, train, autoScroll, isWebpSupported}) => {

    const [trainLongitude, trainLatitude] = [train.TrainData.Longitute, train.TrainData.Latititute];
    const allStationsDistance = allStationsInpath.map((station) => {

        return {
            ...station,
            distance: haversine([trainLongitude, trainLatitude], station.platformPosOverride!)
        }
    })

    const nearestStation = _minBy(allStationsDistance, 'distance');

    const closestStationIndex = trainTimetable.map((s) => s.station).findIndex((s) => s === nearestStation?.srId)
    // console.log("Closest station Index : ", closestStationIndex);


    // console.log("Nearest station : ", nearestStation);

    autoScroll && scrollToNearestStation(nearestStation?.id);
    return (
        <div className="h-full child:!rounded-none child:snap-y child:snap-mandatory child:overflow-y-scroll child:h-full">
            <Table striped={true}>
                <Table.Body>
                    {
                        trainTimetable.map((ttRow, index: number) => {
                            const internalId = postToInternalIds[encodeURIComponent(ttRow.station)]?.id
                            return (
                                <React.Fragment key={`${ttRow.km}${ttRow.line}${ttRow.station}}`}>
                                    <Table.Row
                                        className={classNames(
                                            "hover:bg-gray-200 dark:hover:bg-gray-600 snap-start",
                                        {"!bg-amber-100 !text-gray-600 hover:!bg-amber-200": internalId === nearestStation?.id}
                                        )}
                                        data-internalid={internalId}
                                    >
                                        <Table.Cell className="relative pl-8">
                                            <div className="flex flex-col">
                                                <TrainTimetableTimeline itemIndex={index} closestStationIndex={closestStationIndex} isAtTheStation={index === closestStationIndex} />
                                                <div className="flex justify-between">
                                                    <span>{Math.round(ttRow.km * 10) / 10} km</span>
                                                    <span>L{ttRow.line}</span>
                                                </div>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {ttRow.scheduled_arrival_hour}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {ttRow.station}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {ttRow.scheduled_departure_hour}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {ttRow.layover}
                                        </Table.Cell>
                                    </Table.Row>
                                {
                                    ttRow.speedLimitsToNextStation.map((sltn, _index: number) => {
                                        const vMaxHigh = parseInt(sltn.vMax) > 100;
                                        const vMaxMedium = parseInt(sltn.vMax) >= 70 && parseInt(sltn.vMax) <= 100;
                                        const vMaxLow = parseInt(sltn.vMax) < 70;
                                        if (_index > 0 && parseInt(ttRow.speedLimitsToNextStation[_index - 1].vMax) === parseInt(sltn.vMax)) {
                                            return <React.Fragment key={`${_index}-line-${sltn.lineNo}-track-${sltn.track}`}></React.Fragment>;
                                        }
                                        return (
                                            <Table.Row key={`${_index}-line-${sltn.lineNo}-track-${sltn.track}`} className={`snap-start ma-0`}>
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
