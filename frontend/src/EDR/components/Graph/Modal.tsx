import React, {ReactNode} from "react";
import {Button, Modal} from "flowbite-react";
import {useTranslation} from "react-i18next";
import {frameHeight} from "../SimRailMapModal";

export type GraphModalProps = {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export const GraphModal: React.FC<GraphModalProps> = ({children, isOpen, onClose}) => {
    const {t} = useTranslation();
    return (
        <Modal className="z-50" position="top-center" show={isOpen}  size="9xl" onClose={onClose} style={{zIndex: 999999}}>
        <Modal.Header>
            <div className="flex justify-between w-full">
                <span>{t("EDR_GRAPH_title")}</span>
                <Button size="xs" className="ml-8" onClick={() => {
                    window.open(document.URL + "?graphFullScreenMode=1", "_blank")
                }}>{t("EDR_GRAPH_open_new_window")}</Button>
            </div>
        </Modal.Header>
        <Modal.Body className={frameHeight}>
            {children}
        </Modal.Body>
    </Modal>
    )
}
