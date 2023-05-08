import React from "react";
import {GraphModal, GraphModalProps} from "./Modal";
import GraphContent, {GraphProps} from "./Graph";

type Props = {
    fullScreenMode: boolean;
    serverCode: string | undefined;
} & Omit<GraphModalProps & GraphProps, 'children'>
const Graph: React.FC<Props> = (props) => {
    const {serverTzOffset, serverTime, timetable, post, serverCode} = props;
    const {isOpen, onClose} = props;
    const graphBody = <GraphContent serverTzOffset={serverTzOffset} serverTime={serverTime} timetable={timetable} post={post} serverCode={serverCode}/>

    return props.fullScreenMode ? <div className="h-screen w-screen">{graphBody}</div> : <GraphModal isOpen={isOpen} onClose={onClose}>{graphBody}</GraphModal>
}

export default Graph;
