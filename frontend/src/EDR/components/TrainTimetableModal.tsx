import {Modal, Table} from "flowbite-react";
import React from "react";
import {Spinner} from "flowbite-react";
import { DetailedTrain } from "../functions/trainDetails";
import TrainTimetableTimeline from "./TrainTimetableTimeline";
import {frameHeight} from "./SimRailMapModal";
import { TrainTimeTableRow } from "../../Sirius";
import { format } from "date-fns";
import Tooltip from "rc-tooltip";
import { edrImagesMap } from "../../config";
import { useTranslation } from "react-i18next";

type Props = {
    trainDetails?: DetailedTrain;
    setModalTrainId: (trainId: string | undefined) => void;
    trainTimetable?: TrainTimeTableRow[];
}

type BodyProps = {
    timetable?: TrainTimeTableRow[];
    closestStation?: string;
    closestStationIndex?: number | undefined;
}

const TrainTimetableBody: React.FC<BodyProps> = ({timetable, closestStation, closestStationIndex}) => {
    const {t} = useTranslation();
    if (!timetable) return <Spinner />
    if (timetable.length === 0) return <>&nbsp;</>

    return (
        <Table className={frameHeight} striped>
            <Table.Head>
                <Table.HeadCell>{t('EDR_UI_timetable_times')}</Table.HeadCell>
                <Table.HeadCell>{t('EDR_UI_timetable_station')}</Table.HeadCell>
                <Table.HeadCell>{t('EDR_UI_timetable_layover')}</Table.HeadCell>
            </Table.Head>
            <Table.Body>
                {timetable.map((ttRow, index: number) => {
                    return (<Table.Row 
                        className="hover:bg-gray-200 dark:hover:bg-gray-600"
                        key={ttRow.nameForPerson}
                    >
                        <Table.Cell className="relative">
                            <div className="flex flex-col">
                                <TrainTimetableTimeline isAtTheStation={ttRow.nameForPerson === closestStation} itemIndex={index} closestStationIndex={closestStationIndex ?? 0} />
                                {ttRow.scheduledArrivalObject.getFullYear() > 1970 && (
                                    <>
                                        {format(ttRow.scheduledArrivalObject, 'HH:mm')}
                                        <br />
                                    </>
                                )}
                                {ttRow.scheduledDepartureObject.getFullYear() < 3000 && (
                                    <>
                                        {format(ttRow.scheduledDepartureObject, 'HH:mm')}
                                    </>
                                )}
                            </div>
                        </Table.Cell>
                        <Table.Cell>
                            {ttRow.nameForPerson}
                        </Table.Cell>
                        <Table.Cell>
                            {(Math.floor(ttRow.plannedStop) > 0 || ttRow.stopTypeNumber > 0) && <span className="flex">
                                <Tooltip placement="top" overlay={<span>{t("EDR_TRAINROW_layover")}</span>}>
                                    <img id="layover_test" className="h-[13px] lg:h-[26px] mx-2" src={edrImagesMap.LAYOVER} alt="layover" />
                                </Tooltip>
                                {ttRow.plannedStop}&nbsp;{t("EDR_TRAINROW_layover_minutes")}
                            </span>}
                        </Table.Cell>
                    </Table.Row>
                )})}
            </Table.Body>
        </Table>
    )
}

export const TrainTimetableModal: React.FC<Props> = React.memo(({trainDetails, setModalTrainId, trainTimetable}) => {
    const nextStation = trainDetails?.timetable?.find(entry => entry.indexOfPoint === trainDetails?.TrainData?.VDDelayedTimetableIndex);

    return trainDetails?.TrainNoLocal ? <Modal className="z-20" show={!!trainDetails?.TrainNoLocal} size="7xl" onClose={() => setModalTrainId(undefined)} position="top-center" style={{zIndex: 999999}}>
        <Modal.Header>
            <div className="flex justify-around">
                <span>N° {trainDetails?.TrainNoLocal}</span>
            </div>
        </Modal.Header>
        <Modal.Body>
            <div className="max-h-[700px] overflow-y-scroll child:px-2">
                <TrainTimetableBody timetable={trainTimetable} closestStation={nextStation?.nameForPerson} closestStationIndex={nextStation?.indexOfPoint}/>
            </div>
        </Modal.Body>
    </Modal> : null;
});