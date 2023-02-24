import React from "react";
import {Table} from "flowbite-react";

type Props = {
    trainTimetable: any;
}
export const TrainTimetable: React.FC<Props> = ({trainTimetable}) => {
    return (
        <div className="h-full overflow-y-scroll">
            <Table striped={true}>
                <Table.Body>
                    {
                        trainTimetable.map((ttRow: any) => {
                            return (
                                <>
                                <Table.Row key={`${ttRow.km}${ttRow.line}${ttRow.station}}`} className="hover:bg-gray-200 dark:hover:bg-gray-600">
                                    <Table.Cell>
                                        <div className="flex justify-between">
                                            <span>{ttRow.km}</span>
                                            <span>L{ttRow.line}</span>
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
                                ttRow.speedLimitsToNextStation.map((sltn: any, index: number) => {
                                    const vMaxHigh = sltn.vMax > 100;
                                    const vMaxMedium = sltn.vMax >= 70 && sltn.vMax <= 100;
                                    const vMaxLow = sltn.vMax < 70;
                                    return (
                                        <Table.Row key={`${index}-line-${sltn.line}-track-${sltn.track}`} className={`
                                            ${vMaxHigh && '!text-green-900 !bg-green-100 hover:!bg-green-200 dark:!bg-green-300 dark:hover:!bg-green-200'}
                                            ${vMaxMedium && '!text-yellow-900 !bg-yellow-100 hover:!bg-yellow-200 dark:!bg-yellow-300 dark:hover:!bg-yellow-200'}
                                            ${vMaxLow && '!text-red-900 !bg-red-100 hover:!bg-red-200 dark:!bg-red-300 dark:hover:!bg-red-200'}
                                        `}>
                                            <Table.Cell >
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
