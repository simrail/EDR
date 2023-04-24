import React from "react";
import {Badge} from "flowbite-react";
import {tableCellCommonClassnames} from "../TrainRow";
import {DetailedTrain} from "../../functions/trainDetails";
import { TimeTableRow } from "../../../customTypes/TimeTableRow";

type Props = {
    secondColRef: any;
    trainBadgeColor: string;
    ttRow: TimeTableRow;
    trainDetails: DetailedTrain;
    streamMode: boolean;
}
export const TrainTypeCell: React.FC<Props> = ({secondColRef, trainBadgeColor, ttRow, trainDetails, streamMode}) =>
    <td className={tableCellCommonClassnames(streamMode)}  ref={secondColRef}>
        <div className="flex justify-center items-center flex-col space-around">
            <Badge className="" color={trainBadgeColor}>{ttRow.trainType}</Badge>&nbsp;
            {Math.floor(trainDetails?.TrainData?.Velocity) || 0} km/h
        </div>
    </td>;
