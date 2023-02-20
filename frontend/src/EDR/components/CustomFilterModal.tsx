import React from "react";
import {Button, Checkbox, Modal} from "flowbite-react";
import {FilterConfig, presetFilterConfig} from "../index";
import {fi} from "date-fns/locale";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    filterConfig: FilterConfig;
    setFilterConfig: (fc: FilterConfig) => void;
}
export const ColumnFilterModal: React.FC<Props> = ({filterConfig, setFilterConfig, isOpen, onClose}) => {
    const [pendingFilterConfig, setPendingFilterConfig] = React.useState(filterConfig);

    const applyPartialUpdateToFilterConfig = (field: string, value: string | number | boolean | undefined) => {
        setPendingFilterConfig({
            ...pendingFilterConfig,
            [field]: value
        });
    }

    return (
        <React.Fragment>
        <Modal show={isOpen} style={{zIndex: 9999999}} onClose={onClose}>
            <Modal.Header>
                <span className="font-bold">Filter customisation</span>
            </Modal.Header>
            <Modal.Body>
                <div className="text-black dark:text-white">
                    <div className="m1 text-primary">Hide offline trains  <Checkbox checked={pendingFilterConfig.onlyOnTrack} onChange={() => applyPartialUpdateToFilterConfig('onlyOnTrack', !pendingFilterConfig.onlyOnTrack)}/></div>
                    <div className="m1">Hide going away trains  <Checkbox checked={pendingFilterConfig.onlyApproaching} onChange={() => applyPartialUpdateToFilterConfig('onlyApproaching', !pendingFilterConfig.onlyApproaching)}/></div>
                    <div className="m1">Filter by radius (km)</div>
                    <div className="flex mb-1 mt-2">
                        <Button className="mr-2" color={pendingFilterConfig.maxRange === 10 ? undefined : 'gray'} onClick={() => applyPartialUpdateToFilterConfig('maxRange', 10)}>10</Button>
                        <Button className="mr-2" color={pendingFilterConfig.maxRange === 25 ? undefined : 'gray'}  onClick={() => applyPartialUpdateToFilterConfig('maxRange', 25)}>25</Button>
                        <Button className="mr-2" color={pendingFilterConfig.maxRange === 50 ? undefined : 'gray'}  onClick={() => applyPartialUpdateToFilterConfig('maxRange', 50)}>50</Button>
                        <Button className="mr-2" color={pendingFilterConfig.maxRange === 100 ? undefined : 'gray'} onClick={() => applyPartialUpdateToFilterConfig('maxRange', 100)}>100</Button>
                        <Button className="mr-2" color={pendingFilterConfig.maxRange === undefined ? undefined : 'gray'} onClick={() => applyPartialUpdateToFilterConfig('maxRange', undefined)}>No Limit</Button>
                    </div>
                    <div>Filter by scheduled time</div>
                    <div className="flex mb-1 mt-2">
                        <Button className="mr-2" color={pendingFilterConfig.maxTime === 30 ? undefined : 'gray'} onClick={() => applyPartialUpdateToFilterConfig('maxTime', 30)}>30mn</Button>
                        <Button className="mr-2" color={pendingFilterConfig.maxTime === 60 ? undefined : 'gray'} onClick={() => applyPartialUpdateToFilterConfig('maxTime', 60)}>1h</Button>
                        <Button className="mr-2" color={pendingFilterConfig.maxTime === 120 ? undefined : 'gray'} onClick={() => applyPartialUpdateToFilterConfig('maxTime', 120)}>2h</Button>
                        <Button className="mr-2" color={pendingFilterConfig.maxTime === undefined ? undefined : 'gray'} onClick={() => applyPartialUpdateToFilterConfig('maxTime', undefined)}>No Limit</Button>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="w-full flex justify-between">
                <Button color="gray" onClick={() => {setFilterConfig(presetFilterConfig.default); onClose();}}>Reset</Button>
                <Button onClick={() => setFilterConfig(pendingFilterConfig)}>Save</Button>
                </div>
            </Modal.Footer>
        </Modal>
        </React.Fragment>
    )
}
