import React from "react";
import {Button, Modal} from "flowbite-react";

type Props = {
    serverCode: string;
    trainId?: string;
    setModalTrainId: (number: string | undefined) => void;
}
export const SimRailMapModal: React.FC<Props> = ({trainId, setModalTrainId, serverCode}) => (
    <Modal show={!!trainId}>
        <Modal.Header>
            <div className="flex justify-around">
                <span>{trainId}</span>
                <Button onClick={() => setModalTrainId(undefined)}>Close</Button>
            </div>
        </Modal.Header>
        <Modal.Body>
            <iframe src={`https://www.simrail.fr/server/${serverCode}?trainId=${trainId}`} />
        </Modal.Body>
    </Modal>
)
