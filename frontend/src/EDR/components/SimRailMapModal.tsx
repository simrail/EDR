import React from "react";
import {Button, Modal} from "flowbite-react";

type Props = {
    serverCode: string;
    trainId?: string;
    setModalTrainId: (number: string | undefined) => void;
}
export const SimRailMapModal: React.FC<Props> = ({trainId, setModalTrainId, serverCode}) => (
    <Modal className="z-20" show={!!trainId} size="7xl" onClose={() => setModalTrainId(undefined)} position="bottom-center" style={{zIndex: 999999}}>
        <Modal.Header>
            <div className="flex justify-around">
                <span>N° {trainId}</span>
            </div>
        </Modal.Header>
        <Modal.Body>
            <div className="min-h-[700px]">
            <iframe src={`https://www.simrail.fr/server/${serverCode}?trainId=${trainId}`} title="Simrail FR map embedded" width="100%" height="700px"/>
            </div>
        </Modal.Body>
    </Modal>
)
