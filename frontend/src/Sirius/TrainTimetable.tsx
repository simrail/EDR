import React from "react";
import {Table} from "flowbite-react";
import {Train} from "@simrail/types";
import {postToInternalIds, StationConfig} from "../config/stations";
import {haversine} from "../EDR/functions/vectors";
import _minBy from "lodash/minBy";
import classNames from "classnames";
import TrainTimetableTimeline from "../EDR/components/TrainTimetableTimeline";

type Props = {
    trainTimetable: any;
    train: Train;
    allStationsInpath: any;
    autoScroll: boolean;
}

const scrollToNearestStation = (nearestStationId: string) => {
    const allTrainRows = [...Array.from(document.querySelectorAll('[data-internalId]').values())];
    const nearestStationRow = allTrainRows.find((e) => e.getAttribute("data-internalid") === nearestStationId)
    if (nearestStationRow) {
        nearestStationRow.scrollIntoView({
            block: "center"
        })
    }
}
export const TrainTimetable: React.FC<Props> = ({trainTimetable, allStationsInpath, train, autoScroll}) => {

    const [trainLongitude, trainLatitude] = [train.TrainData.Longitute, train.TrainData.Latititute];
    const allStationsDistance: any = allStationsInpath.map((station: StationConfig) => {

        return {
            ...station,
            distance: haversine([trainLongitude, trainLatitude], station.platformPosOverride!)
        }
    })

    const nearestStation: any = _minBy(allStationsDistance, 'distance');

    const closestStationIndex = trainTimetable.map((s: any) => s.station).findIndex((s: string) => s === nearestStation?.srId)
    // console.log("Closest station Index : ", closestStationIndex);


    // console.log("Nearest station : ", nearestStation);

    autoScroll && scrollToNearestStation(nearestStation?.id);
    return (
        <div className="h-full child:!rounded-none child:snap-y child:snap-mandatory child:overflow-y-scroll child:h-full">
            <Table striped={true}>
                <Table.Body>
                    {
                        trainTimetable.map((ttRow: any, index: number) => {
                            const internalId = postToInternalIds[encodeURIComponent(ttRow.station)]?.id
                            return (
                                <>
                                <Table.Row
                                    key={`${ttRow.km}${ttRow.line}${ttRow.station}}`}
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
                                                <span>{ttRow.km}</span>
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
                                ttRow.speedLimitsToNextStation.map((sltn: any, _index: number) => {
                                    const vMaxHigh = sltn.vMax > 100;
                                    const vMaxMedium = sltn.vMax >= 70 && sltn.vMax <= 100;
                                    const vMaxLow = sltn.vMax < 70;
                                    return (
                                        <Table.Row key={`${_index}-line-${sltn.line}-track-${sltn.track}`} className={`
                                            ${vMaxHigh ? '!text-green-900 !bg-green-100 hover:!bg-green-200 dark:!bg-green-300 dark:hover:!bg-green-200' : ''}
                                            ${vMaxMedium ? '!text-yellow-900 !bg-yellow-100 hover:!bg-yellow-200 dark:!bg-yellow-300 dark:hover:!bg-yellow-200' : ''}
                                            ${vMaxLow ? '!text-red-900 !bg-red-100 hover:!bg-red-200 dark:!bg-red-300 dark:hover:!bg-red-200' : ''}
                                            snap-start
                                        `}>
                                            <Table.Cell className="relative pl-8">
                                                <TrainTimetableTimeline renderOnlyLine itemIndex={index} closestStationIndex={closestStationIndex} isAtTheStation={index === closestStationIndex} />
                                                <div className="flex ">
                                                    <span>{sltn.axisStart}</span>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 inline-flex">
                                                        {vMaxHigh && (
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                                                        )}
                                                        {vMaxMedium && (
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                        )}
                                                        {vMaxLow && (
                                                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                        )}
                                                    </svg>
                                                </span>
                                                <span className="ml-1">
                                                    {sltn.vMax}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell colSpan={10}>

                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })
                            }
                            </>
                            )
                        })
                    }
                </Table.Body>
            </Table>

        </div>
    )
}
