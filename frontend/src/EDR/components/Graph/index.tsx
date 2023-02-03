import React from "react";
import {GraphModal, GraphModalProps} from "./Modal";
import GraphContent, {GraphProps} from "./Graph";

type Props = {
    fullScreenMode: boolean;
} & Omit<GraphModalProps & GraphProps, 'children'>
export const Graph: React.FC<Props> = (props) => {
    const {serverTz, timetable, post} = props;
    const {isOpen, onClose} = props;
    const graphBody = <GraphContent serverTz={serverTz} timetable={timetable} post={post}/>

    return props.fullScreenMode ? <div className="h-screen w-screen">{graphBody}</div> : <GraphModal isOpen={isOpen} onClose={onClose}>{graphBody}</GraphModal>
}
