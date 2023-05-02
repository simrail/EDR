import React from "react";
import {CellLineData} from "./CellLineData";
import {tableCellCommonClassnames} from "../TrainRow";
import { TimeTableRow } from "../../../customTypes/TimeTableRow";

type Props = {
    ttRow: TimeTableRow;
    headerSeventhColRef: any;
    secondaryPostData: TimeTableRow[];
    streamMode: boolean;
}
export const TrainToCell: React.FC<Props> = ({headerSeventhColRef, ttRow, secondaryPostData, streamMode}) => (
    <td className={tableCellCommonClassnames(streamMode)} ref={headerSeventhColRef} width="450">
        <div className="inline-flex">
            <CellLineData ttRow={ttRow} />
        </div>
        { secondaryPostData.map((spd: TimeTableRow, i: number) => <span key={spd.trainNoLocal + i}><hr /><div className="inline-flex"><CellLineData ttRow={spd} /></div></span>)}
    </td>
)
