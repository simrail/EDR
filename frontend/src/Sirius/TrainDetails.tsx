import React from 'react';
import { Table } from 'flowbite-react';
import { Train } from '@simrail/types';

type Props = {
    trainNumber: string | undefined;
    trainDetails: Train;
}

export const TrainDetails: React.FC<Props> = ({ trainDetails, trainNumber }) => {
    return (
        <div className="child:!rounded-none child:shadow-none">
            <Table striped={true}>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>
                            Train Number:
                        </Table.Cell>
                        <Table.Cell>
                            {trainNumber}
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Start Station:
                        </Table.Cell>
                        <Table.Cell>
                            {trainDetails.StartStation}
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            End Station:
                        </Table.Cell>
                        <Table.Cell>
                            {trainDetails.EndStation}
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Train Name:
                        </Table.Cell>
                        <Table.Cell>
                            {trainDetails.TrainName}
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            Train Model:
                        </Table.Cell>
                        <Table.Cell>
                            {trainDetails.Vehicles[0]}
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </div>
    );
}