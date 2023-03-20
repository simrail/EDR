import React from "react";
import { dispatchDirections } from "../../../config/stations";
import {TimeTableRow} from "../../index";
import {tableCellCommonClassnames} from "../TrainRow";
import { edrImagesMap } from "../../../config";

type Props = {
    headerFourthColRef: any;
    ttRow: TimeTableRow;
    secondaryPostData: TimeTableRow[];
    streamMode: boolean;
}
export const TrainFromCell: React.FC<Props> = ({headerFourthColRef, ttRow, secondaryPostData, streamMode}) => {
    const directions = dispatchDirections[parseInt(ttRow.pointId)];
    const isFromLeft = directions.left.includes(parseInt(ttRow.from_post_id));
    const isFromRight = directions.right.includes(parseInt(ttRow.from_post_id));
    const isFromUp = directions?.up?.includes(parseInt(ttRow.from_post_id));
    const isFromDown = directions?.down?.includes(parseInt(ttRow.from_post_id));

    return (<td className={tableCellCommonClassnames(streamMode)} ref={headerFourthColRef}>
        <div className="inline-flex">
            <span className="pr-2">
                { isFromLeft && <img height={20} width={20} src={edrImagesMap.DIRECTION_RIGHT} alt="right-arrow" />}
                { isFromRight && <img height={20} width={20} src={edrImagesMap.DIRECTION_LEFT} alt="left-arrow" />}
                { isFromUp && <img height={20} width={20} src={edrImagesMap.DIRECTION_DOWN} alt="down-arrow" />}
                { isFromDown && <img height={20} width={20} src={edrImagesMap.DIRECTION_UP} alt="up-arrow" />}
            </span>
            {ttRow.from_post}
        </div>
        
        { secondaryPostData.map((spd: TimeTableRow, i: number) => {
            const directions = dispatchDirections[parseInt(spd.pointId)];
            const isFromLeft = directions.left.includes(parseInt(spd.from_post_id));
            const isFromRight = directions.right.includes(parseInt(spd.from_post_id));
            const isFromUp = directions?.up?.includes(parseInt(spd.from_post_id));
            const isFromDown = directions?.down?.includes(parseInt(spd.from_post_id));
            
            return (<span key={spd.train_number + i}><hr />
                <div className="inline-flex">
                    <span className="pr-2">
                        { isFromLeft && <img height={20} width={20} src={edrImagesMap.DIRECTION_RIGHT} alt="right-arrow" />}
                        { isFromRight && <img height={20} width={20} src={edrImagesMap.DIRECTION_LEFT} alt="left-arrow" />}
                        { isFromUp && <img height={20} width={20} src={edrImagesMap.DIRECTION_DOWN} alt="down-arrow" />}
                        { isFromDown && <img height={20} width={20} src={edrImagesMap.DIRECTION_UP} alt="up-arrow" />}
                    </span>
                    <span>
                        {spd.from_post}
                    </span>
                </div>
            </span>
            );
        })}
    </td>);
};
