import React from "react";
import { dispatchDirections } from "../../../config/stations";
import {TimeTableRow} from "../../index";
import {tableCellCommonClassnames} from "../TrainRow";

type Props = {
    headerFourthColRef: any;
    ttRow: TimeTableRow;
    secondaryPostData: TimeTableRow[];
    streamMode: boolean;
}
export const TrainFromCell: React.FC<Props> = ({headerFourthColRef, ttRow, secondaryPostData, streamMode}) => {
    const directions = dispatchDirections[parseInt(ttRow.pointId)];
    const isFromLeft = directions?.left?.includes(parseInt(ttRow.fromPostId));
    const isFromRight = directions?.right?.includes(parseInt(ttRow.fromPostId));
    const isFromUp = directions?.up?.includes(parseInt(ttRow.fromPostId));
    const isFromDown = directions?.down?.includes(parseInt(ttRow.fromPostId));

    return (<td className={tableCellCommonClassnames(streamMode)} ref={headerFourthColRef}>
        <div className="inline-flex">
            <span className="pr-2">
                { isFromLeft && <span className="font-bold text-teal-400">【🢂】</span>}
                { isFromRight && <span className="font-bold text-orange-400">【🢀】</span>}
                { isFromUp && <span className="font-bold text-purple-400">【🢃】</span>}
                { isFromDown && <span className="font-bold text-green-400">【🢁】</span>}
            </span>
            {ttRow.fromPost}
        </div>
        
        { secondaryPostData.map((spd: TimeTableRow, i: number) => {
            const directions = dispatchDirections[parseInt(spd.pointId)];
            const isFromLeft = directions?.left?.includes(parseInt(spd.fromPostId));
            const isFromRight = directions?.right?.includes(parseInt(spd.fromPostId));
            const isFromUp = directions?.up?.includes(parseInt(spd.fromPostId));
            const isFromDown = directions?.down?.includes(parseInt(spd.fromPostId));
            
            return (<span key={spd.trainNumber + i}><hr />
                <div className="inline-flex">
                    <span className="pr-2">
                        { isFromLeft && <span className="font-bold text-teal-400">【🢂】</span>}
                        { isFromRight && <span className="font-bold text-orange-400">【🢀】</span>}
                        { isFromUp && <span className="font-bold text-purple-400">【🢃】</span>}
                        { isFromDown && <span className="font-bold text-green-400">【🢁】</span>}
                    </span>
                    <span>
                        {spd.fromPost}
                    </span>
                </div>
            </span>
            );
        })}
    </td>);
};
