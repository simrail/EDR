import React from "react";
import {TimeTableRow} from "../../index";
import {tableCellCommonClassnames} from "../TrainRow";

type Props = {
    headerFourthColRef: any;
    ttRow: TimeTableRow;
    secondaryPostData: TimeTableRow[];
}
export const TrainFromCell: React.FC<Props> = ({headerFourthColRef, ttRow, secondaryPostData}) => (
    <td className={tableCellCommonClassnames} ref={headerFourthColRef}>
        {ttRow.from}
        { secondaryPostData.map((spd: TimeTableRow, i: number) => <span key={spd.train_number + i}><hr />{spd.from}</span>)}
    </td>
);
