import React from 'react';
import { Table } from 'flowbite-react';
import { Train } from '@simrail/types';
import { useTranslation } from 'react-i18next';

type Props = {
    trainNumber: string | undefined;
    trainDetails: Train;
}

export const TrainDetails: React.FC<Props> = ({ trainDetails, trainNumber }) => {
    const {t} = useTranslation();

    return (
        <div className="child:!rounded-none child:shadow-none">
            <Table striped={true}>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>
                            {t("DRIVER_DETAILS_train_number")}:
                        </Table.Cell>
                        <Table.Cell>
                            {trainNumber}
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            {t("DRIVER_DETAILS_start_station")}:
                        </Table.Cell>
                        <Table.Cell>
                            {trainDetails.StartStation}
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            {t("DRIVER_DETAILS_end_station")}:
                        </Table.Cell>
                        <Table.Cell>
                            {trainDetails.EndStation}
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            {t("DRIVER_DETAILS_service_type")}:
                        </Table.Cell>
                        <Table.Cell>
                            {trainDetails.TrainName}
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>
                            {t("DRIVER_DETAILS_train_model")}:
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