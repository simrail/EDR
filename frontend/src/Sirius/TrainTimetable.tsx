import React from "react";
import {Table} from "flowbite-react";

type Props = {
    trainTimetable: any;
}
export const TrainTimetable: React.FC<Props> = ({trainTimetable}) => {
    return (
        <div className="max-h-[60vh] overflow-y-scroll">
            <Table striped={true}>
                <Table.Body>
                    {
                        trainTimetable.map((ttRow: any) => {
                            return (
                                <>
                                <Table.Row key={`${ttRow.km}${ttRow.line}${ttRow.station}}`}>
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
                                ttRow.speedLimitsToNextStation.map((sltn: any) => {
                                    return (
                                        <Table.Row>
                                            <Table.Cell >
                                                <div className="flex ">
                                                    <span>{sltn.axisStart}</span>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="pl-8">{sltn.vMax}</span>
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
