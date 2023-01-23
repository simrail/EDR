import React from "react";
import {Badge} from "flowbite-react";
import {tableCellCommonClassnames} from "../TrainRow";
import {TimeTableRow} from "../../index";
import {DetailedTrain} from "../../functions/trainDetails";

type Props = {
    secondColRef: any;
    trainBadgeColor: string;
    ttRow: TimeTableRow;
    trainDetails: DetailedTrain;
}
export const TrainTypeCell: React.FC<Props> = ({secondColRef, trainBadgeColor, ttRow, trainDetails}) =>
    <td className={tableCellCommonClassnames}  ref={secondColRef}>
        <div className="flex justify-center items-center flex-col space-around">
            <Badge className="" color={trainBadgeColor}>{ttRow.type}</Badge>&nbsp;
            {Math.floor(trainDetails?.TrainData?.Velocity) || 0}/{ttRow.type_speed ?? '??'}km/h
        </div>
    </td>;
