import React, { useEffect } from "react";
import {Dropdown, Modal} from "flowbite-react";
import { useTranslation } from "react-i18next";

type Props = {
    serverCode: string;
    trainId?: string;
    setModalTrainId: (number: string | undefined) => void;
}

export const frameHeight = "max-h-[70vh] min-h-[300px] md:min-h-[400px] lg:min-h-[600px] w-full"
export const SimRailMapModal: React.FC<Props> = ({trainId, setModalTrainId, serverCode}) => {
    const [mapLink, setMapLink] = React.useState<number>(() => {
        const saved = localStorage.getItem("map");
        const initialValue = saved ? JSON.parse(saved) : undefined;
        return initialValue || 0;
    });
    const { t } = useTranslation();

    useEffect(() => {
        localStorage.setItem("map", JSON.stringify(mapLink));
    }, [mapLink]);

    return (
    <Modal className="z-20" show={!!trainId} size="7xl" onClose={() => setModalTrainId(undefined)} position="top-center" style={{zIndex: 999999}}>
        <Modal.Header>
            <div className="flex">
                <div className="flex pt-1">
                    <span>N° {trainId}</span>
                </div>
                <div className="flex px-2">
                    <Dropdown label={<>{t("EDR_UI_map_select")}</>} size="sm">
                        <Dropdown.Item onClick={() => setMapLink(0)}>
                            map.simrail.app
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setMapLink(1)}>
                            simrail.me
                        </Dropdown.Item>
                    </Dropdown>
                </div>
            </div>
        </Modal.Header>
        <Modal.Body>
            <div className="min-h-[700px]">
                { (mapLink === 0) && <iframe src={`https://map.simrail.app/server/${serverCode}?trainId=${trainId}`} title="Simrail FR map embedded" className={frameHeight}/>}
                { (mapLink === 1) && <iframe src={`https://simrail.me/?embed&sid=${serverCode}&tid=${trainId}&showDetails=false`} title="simrail.me map embedded" className={frameHeight}/>}
            </div>
        </Modal.Body>
    </Modal>
    );
}