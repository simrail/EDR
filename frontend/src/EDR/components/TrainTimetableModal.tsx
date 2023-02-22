import {Modal, Table} from "flowbite-react";
import React from "react";
import {getTrainTimetable} from "../../api/api";
import {Spinner} from "flowbite-react/lib/esm/components/Spinner";
import { DetailedTrain } from "../functions/trainDetails";
import TrainTimetableTimeline from "./TrainTimetableTimeline";

type Props = {
    trainDetails?: DetailedTrain | undefined;
    setModalTrainId: (trainId: string | undefined) => void;
}

const TrainTimetableBody: React.FC<{timetable?: any[], closestStation?: string, lineTrace: any}> = ({timetable, closestStation, lineTrace}) => {
    if (!timetable) return <Spinner />
    if (timetable.length === 0) return <>&nbsp; Some trains may be missing during beta</>
    const closestStationInLineTrace = () => lineTrace.map((lts: any) => [lts.srId, lts]).filter(([stationName]: [string, any]) => !!timetable.find((ttRow) => ttRow.station === stationName))[0]?.[0];
    const maybeClosestStationDirect = timetable.findIndex(ttRow => ttRow.station === closestStation);

    // I use an IIFE here because calling the linetrace is expensive, so I make sur it is called only when fallback is needed
    const closestStationIndex = maybeClosestStationDirect === -1 ? function() {
        const closestStation = closestStationInLineTrace();
        return timetable.findIndex(ttRow => ttRow.station === closestStation)
    }() : maybeClosestStationDirect

    console.log("Closest station corrected : ", closestStationIndex);

    return (
        <Table className="max-h-[700px]" striped>
            <Table.Head>
                <Table.HeadCell>Times</Table.HeadCell>
                <Table.HeadCell>Station</Table.HeadCell>
                <Table.HeadCell>Stop</Table.HeadCell>
            </Table.Head>
            <Table.Body>
                {timetable.map((ttRow, index: number) => (
                    <Table.Row key={ttRow.station}>
                        <Table.Cell className="relative">
                            <div className="flex flex-col">
                                <TrainTimetableTimeline isAtTheStation={ttRow.station === closestStation} itemIndex={index} closestStationIndex={closestStationIndex} />
                                {ttRow.scheduled_arrival_hour?.length > 0 && (
                                    <>
                                        {ttRow.scheduled_arrival_hour}
                                        <br />
                                    </>
                                )}
                                {ttRow.scheduled_departure_hour}
                            </div>
                        </Table.Cell>
                        <Table.Cell>
                            {ttRow.station}
                        </Table.Cell>
                        <Table.Cell>
                            {ttRow.layover}&nbsp;{ttRow.stop_type}
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}

export const TrainTimetableModal: React.FC<Props> = React.memo(({trainDetails, setModalTrainId}) => {
    const [trainTimetable, setTrainTimetable] = React.useState();

    React.useEffect(() => {
        if (trainDetails?.TrainNoLocal === undefined)  {
            setTrainTimetable(undefined);
            return;
        }
        getTrainTimetable(trainDetails.TrainNoLocal).then(setTrainTimetable);
    }, [trainDetails]);

    const lineTrace = trainDetails?.pfLineTrace;

    return trainDetails?.TrainNoLocal ? <Modal className="z-20" show={!!trainDetails?.TrainNoLocal} size="7xl" onClose={() => setModalTrainId(undefined)} position="bottom-center" style={{zIndex: 999999}}>
        <Modal.Header>
            <div className="flex justify-around">
                <span>N° {trainDetails?.TrainNoLocal} (Beta)</span>
            </div>
        </Modal.Header>
        <Modal.Body>
            <div className="max-h-[700px] overflow-y-scroll child:px-2">
                <TrainTimetableBody timetable={trainTimetable} closestStation={trainDetails.closestStation} lineTrace={lineTrace}/>
            </div>
        </Modal.Body>
    </Modal> : null;
});