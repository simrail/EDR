import React from "react";
import {Modal} from "flowbite-react";

type Props = {
    serverCode: string;
    trainId?: string;
    setModalTrainId: (number: string | undefined) => void;
}

const frameHeight = "min-h-[300px] md:min-h-[400px] lg:min-h-[600px] w-full"
export const SimRailMapModal: React.FC<Props> = ({trainId, setModalTrainId, serverCode}) => (
    <Modal className="z-20" show={!!trainId} size="7xl" onClose={() => setModalTrainId(undefined)} position="bottom-center" style={{zIndex: 999999}}>
        <Modal.Header>
            <div className="flex justify-around">
                <span>N° {trainId}</span>
            </div>
        </Modal.Header>
        <Modal.Body>
            <div className={frameHeight}>
            <iframe src={`https://www.simrail.fr/server/${serverCode}?trainId=${trainId}`}  title="Simrail FR map embedded" className={frameHeight}/>
            </div>
        </Modal.Body>
    </Modal>
)
