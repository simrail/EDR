import React from "react";
import {CellLineData} from "./CellLineData";
import {TimeTableRow} from "../../index";
import {tableCellCommonClassnames} from "../TrainRow";

type Props = {
    ttRow: TimeTableRow;
    headerSeventhColRef: any;
    secondaryPostData: TimeTableRow[];
    streamMode: boolean;
}
export const TrainToCell: React.FC<Props> = ({headerSeventhColRef, ttRow, secondaryPostData, streamMode}) => (
    <td className={tableCellCommonClassnames(streamMode)} ref={headerSeventhColRef}>
        <div className="inline-flex">
            <CellLineData ttRow={ttRow} />
        </div>
        { secondaryPostData.map((spd: TimeTableRow, i: number) => <span key={spd.trainNumber + i}><hr /><div className="inline-flex"><CellLineData ttRow={spd} /></div></span>)}
    </td>
)
