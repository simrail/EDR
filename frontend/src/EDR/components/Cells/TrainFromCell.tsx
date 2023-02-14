import React from "react";
import {TimeTableRow} from "../../index";
import {tableCellCommonClassnames} from "../TrainRow";

type Props = {
    headerFourthColRef: any;
    ttRow: TimeTableRow;
    secondaryPostData: TimeTableRow[];
    streamMode: boolean;
}
export const TrainFromCell: React.FC<Props> = ({headerFourthColRef, ttRow, secondaryPostData, streamMode}) => (
    <td className={tableCellCommonClassnames(streamMode)} ref={headerFourthColRef}>
        {ttRow.from}
        { secondaryPostData.map((spd: TimeTableRow, i: number) => <span key={spd.train_number + i}><hr />{spd.from}</span>)}
    </td>
);
