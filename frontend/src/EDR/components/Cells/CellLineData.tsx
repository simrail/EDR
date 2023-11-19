import React from "react";
import {useTranslation} from "react-i18next";
import {edrImagesMap} from "../../../config";
import { dispatchDirections } from "../../../config/stations";
import { TimeTableRow } from "../../../customTypes/TimeTableRow";
import { DetailedTrain } from "../../functions/trainDetails";

type Props = {
    ttRow: TimeTableRow;
    trainDetails: DetailedTrain;
}
export const CellLineData: React.FC<Props> = ({ttRow, trainDetails}) => {
    const {t} = useTranslation();
    const directions = dispatchDirections[parseInt(ttRow.pointId)];
    const isHeadingLeft = ttRow.toPostId ? directions?.left?.includes(parseInt(ttRow.toPostId)) : false;
    const isHeadingRight = ttRow.toPostId ? directions?.right?.includes(parseInt(ttRow.toPostId)) : false;
    const isHeadingUp = ttRow.toPostId ? directions?.up?.includes(parseInt(ttRow.toPostId)) : false;
    const isHeadingDown = ttRow.toPostId ? directions?.down?.includes(parseInt(ttRow.toPostId)) : false;

    return <>
        <span className="pr-2">
        { isHeadingLeft && <span className="font-bold text-orange-400">【🢀】</span>}
        { isHeadingRight && <span className="font-bold text-teal-400">【🢂】</span>}
        { isHeadingUp && <span className="font-bold text-green-400">【🢁】</span>}
        { isHeadingDown && <span className="font-bold text-purple-400">【🢃】</span>}
        </span>
        {ttRow.toPost}
        <img className="inline-block pl-1 pb-1" src={edrImagesMap.RIGHT_ARROW} height={18} width={18} alt="r_arrow"/>️
        <b><span className="hidden lg:inline">&nbsp;{t("EDR_TRAINROW_line")}:&nbsp;</span>{trainDetails?.timetable?.[trainDetails?.timetable?.findIndex(entry => entry.pointId === ttRow.pointId) + 1]?.line ?? ttRow.line}</b>
    </>
}
