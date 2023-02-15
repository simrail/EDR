import {Modal, Table} from "flowbite-react";
import React from "react";
import {getTrainTimetable} from "../../api/api";
import {Spinner} from "flowbite-react/lib/esm/components/Spinner";

type Props = {
    trainId?: string;
    setModalTrainId: (trainId: string | undefined) => void;
}

const TrainTimetableBody: React.FC<{timetable?: any[]}> = ({timetable}) => {
    if (!timetable) return <Spinner />
    if (timetable.length === 0) return <>&nbsp; Some trains may be missing during beta</>
    return (
        <Table className="max-h-[700px]" striped>
            <Table.Head>
                <Table.HeadCell>Times</Table.HeadCell>
                <Table.HeadCell>Station</Table.HeadCell>
                <Table.HeadCell>Stop</Table.HeadCell>
            </Table.Head>
            <Table.Body>
                {timetable.map((ttRow) => (
                    <Table.Row key={ttRow.station}>
                        <Table.Cell>
                            <div className="flex flex-col">
                                {ttRow.scheduled_arrival_hour} <br />
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

export const TrainTimetableModal: React.FC<Props> = React.memo(({trainId, setModalTrainId}) => {
    const [trainTimetable, setTrainTimetable] = React.useState();

    React.useEffect(() => {
        if (trainId === undefined)  {
            setTrainTimetable(undefined);
            return;
        }
        getTrainTimetable(trainId!).then(setTrainTimetable);
    }, [trainId]);

    return trainId ? <Modal className="z-20" show={!!trainId} size="7xl" onClose={() => setModalTrainId(undefined)} position="bottom-center" style={{zIndex: 999999}}>
        <Modal.Header>
            <div className="flex justify-around">
                <span>N° {trainId} (Beta)</span>
            </div>
        </Modal.Header>
        <Modal.Body>
            <div className="max-h-[700px] overflow-y-scroll">
                <TrainTimetableBody timetable={trainTimetable} />
            </div>
        </Modal.Body>
    </Modal> : null;
});