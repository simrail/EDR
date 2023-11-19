import React from "react";
import {CellLineData} from "./CellLineData";
import {tableCellCommonClassnames} from "../TrainRow";
import { TimeTableRow } from "../../../customTypes/TimeTableRow";
import { DetailedTrain } from "../../functions/trainDetails";

type Props = {
    ttRow: TimeTableRow;
    headerSeventhColRef: any;
    secondaryPostData: TimeTableRow[];
    streamMode: boolean;
    trainDetails: DetailedTrain;
}
export const TrainToCell: React.FC<Props> = ({headerSeventhColRef, ttRow, secondaryPostData, streamMode, trainDetails}) => (
    <td className={tableCellCommonClassnames(streamMode)} ref={headerSeventhColRef} width="450">
        <div className="inline-flex">
            <CellLineData ttRow={ttRow} trainDetails={trainDetails} />
        </div>
        { secondaryPostData.map((spd: TimeTableRow, i: number) => <span key={spd.trainNoLocal + i}><hr /><div className="inline-flex"><CellLineData ttRow={spd} trainDetails={trainDetails} /></div></span>)}
    </td>
)
