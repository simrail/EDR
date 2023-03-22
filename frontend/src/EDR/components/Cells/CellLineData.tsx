import React from "react";
import {useTranslation} from "react-i18next";
import { TimeTableRow } from "../../index";
import {edrImagesMap} from "../../../config";
import { dispatchDirections } from "../../../config/stations";

type Props = {
    ttRow: TimeTableRow;
}
export const CellLineData: React.FC<Props> = ({ttRow}) => {
    const {t} = useTranslation();
    const directions = dispatchDirections[parseInt(ttRow.pointId)];
    const isHeadingLeft = directions.left.includes(parseInt(ttRow.to_post_id));
    const isHeadingRight = directions.right.includes(parseInt(ttRow.to_post_id));
    const isHeadingUp = directions?.up?.includes(parseInt(ttRow.to_post_id));
    const isHeadingDown = directions?.down?.includes(parseInt(ttRow.to_post_id));

    return <>
        <span className="pr-2">
            { isHeadingLeft && <span className="font-bold">🢀</span>}
            { isHeadingRight && <span className="font-bold">🢂</span>}
            { isHeadingUp && <span className="font-bold">🢁</span>}
            { isHeadingDown && <span className="font-bold">🢃</span>}
        </span>
        {ttRow.to_post}
        <img className="inline-block pl-1 pb-1" src={edrImagesMap.RIGHT_ARROW} height={18} width={18} alt="r_arrow"/>️
        <b><span className="hidden lg:inline">{t("EDR_TRAINROW_line")}:&nbsp;</span>{ttRow.line}</b>
    </>
}
